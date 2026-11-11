import { computeAcquisition } from './acquisition'
import { computeComparison } from './comparison'
import type { Cents, FinancedKind, SimulationState } from './types'

export type SensitivityParameter = 'tan' | 'months' | 'downPayment' | 'finalPayment'
export type SensitivityMetric = 'monthlyOutflow' | 'totalInterest' | 'totalEconomicCost'

export interface SensitivityPoint {
  value: number
  monthlyOutflow: Cents
  totalInterest: Cents
  totalEconomicCost: Cents
}

export function computeSensitivity(
  state: SimulationState,
  method: FinancedKind,
  parameter: SensitivityParameter,
): SensitivityPoint[] {
  const { netPurchasePrice: N } = computeAcquisition(state)
  const loan = state.loan
  const balloon = state.balloon
  const leasing = state.leasing

  let current: number
  let offsets: number[]
  let apply: (s: SimulationState, value: number) => SimulationState

  if (parameter === 'tan') {
    current = method === 'loan' ? loan.tanPercent : method === 'balloon' ? balloon.tanPercent : leasing.tanPercent
    offsets = [-3, -2, -1, 0, 1, 2, 3]
    apply = (s, value) => {
      if (method === 'loan') return { ...s, loan: { ...s.loan, tanPercent: value } }
      if (method === 'balloon') return { ...s, balloon: { ...s.balloon, tanPercent: value } }
      return { ...s, leasing: { ...s.leasing, tanPercent: value } }
    }
  } else if (parameter === 'months') {
    current = method === 'loan' ? loan.months : method === 'balloon' ? balloon.months : leasing.months
    offsets = [-24, -12, 0, 12, 24]
    apply = (s, value) => {
      if (method === 'loan') return { ...s, loan: { ...s.loan, months: value } }
      if (method === 'balloon') return { ...s, balloon: { ...s.balloon, months: value } }
      return { ...s, leasing: { ...s.leasing, months: value } }
    }
  } else {
    const step = Math.round((N / 100) * 0.05)
    offsets = [-3, -2, -1, 0, 1, 2, 3].map((k) => k * step)
    if (parameter === 'downPayment') {
      current = method === 'loan' ? loan.downPayment : method === 'balloon' ? balloon.downPayment : leasing.initialPayment
      apply = (s, value) => {
        if (method === 'loan') return { ...s, loan: { ...s.loan, downPayment: value } }
        if (method === 'balloon') return { ...s, balloon: { ...s.balloon, downPayment: value } }
        return { ...s, leasing: { ...s.leasing, initialPayment: value } }
      }
    } else {
      current = method === 'balloon' ? balloon.balloonPayment : leasing.buyout
      apply = (s, value) => {
        if (method === 'balloon') return { ...s, balloon: { ...s.balloon, balloonPayment: value } }
        return { ...s, leasing: { ...s.leasing, buyout: value } }
      }
    }
  }

  const clamp = (v: number): number => {
    if (parameter === 'tan') return Math.min(30, Math.max(0, v))
    if (parameter === 'months') return Math.min(120, Math.max(6, Math.round(v)))
    return Math.max(0, v)
  }

  const values = offsets
    .map((o) => clamp(current + o))
    .filter((v, i, arr) => arr.indexOf(v) === i)

  const points: SensitivityPoint[] = []
  for (const value of values) {
    const result = computeComparison(apply(state, value))
    const m = result[method]
    if (!m.valid) continue
    points.push({
      value,
      monthlyOutflow: m.monthlyOutflow,
      totalInterest: m.totalInterest,
      totalEconomicCost: m.totalEconomicCost,
    })
  }
  return points
}

export function currentParameterValue(state: SimulationState, method: FinancedKind, parameter: SensitivityParameter): number {
  const loan = state.loan
  const balloon = state.balloon
  const leasing = state.leasing
  if (parameter === 'tan') return method === 'loan' ? loan.tanPercent : method === 'balloon' ? balloon.tanPercent : leasing.tanPercent
  if (parameter === 'months') return method === 'loan' ? loan.months : method === 'balloon' ? balloon.months : leasing.months
  if (parameter === 'downPayment') {
    return method === 'loan' ? loan.downPayment : method === 'balloon' ? balloon.downPayment : leasing.initialPayment
  }
  return method === 'balloon' ? balloon.balloonPayment : leasing.buyout
}
