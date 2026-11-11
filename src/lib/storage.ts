import type { SimulationState } from '@/domain/financing/types'

export const SIMULATION_KEY = 'my-next-car:simulation:v1'
export const BASELINE_KEY = 'my-next-car:baseline:v1'

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const isBool = (v: unknown): v is boolean => typeof v === 'boolean'
const isStr = (v: unknown): v is string => typeof v === 'string'
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

function hasNumbers(obj: unknown, keys: string[]): boolean {
  if (!isObj(obj)) return false
  return keys.every((k) => isNum(obj[k]))
}

// Future schema versions will add a migration step in this function.
export function parseSimulation(value: unknown): SimulationState | null {
  if (!isObj(value)) return null
  if (value.schemaVersion !== 1) return null

  const vehicle = value.vehicle
  if (
    !isObj(vehicle) ||
    !isStr(vehicle.name) ||
    !['electric', 'hybrid', 'combustion', 'other'].includes(vehicle.type as string) ||
    !['new', 'used'].includes(vehicle.condition as string)
  ) {
    return null
  }

  if (
    !hasNumbers(value.acquisition, [
      'listPrice',
      'discount',
      'scrappageIncentive',
      'otherIncentives',
      'additionalCosts',
      'tradeInValue',
      'tradeInOutstandingLoan',
    ])
  ) {
    return null
  }
  if (!hasNumbers(value.shared, ['downPayment', 'months', 'tanPercent', 'upfrontFees', 'monthlyFee'])) return null
  if (!hasNumbers(value.loan, ['downPayment', 'months', 'tanPercent', 'upfrontFees', 'monthlyFee', 'quotedTaegPercent'])) {
    return null
  }
  const balloon = value.balloon
  if (
    !isObj(balloon) ||
    !hasNumbers(balloon, ['downPayment', 'months', 'tanPercent', 'upfrontFees', 'monthlyFee', 'quotedTaegPercent']) ||
    !isNum(balloon.balloonPayment) ||
    !isBool(balloon.returnOptionEnabled) ||
    !isNum(balloon.returnFees)
  ) {
    return null
  }
  const leasing = value.leasing
  if (
    !isObj(leasing) ||
    !['calculated', 'quoted'].includes(leasing.mode as string) ||
    !hasNumbers(leasing, [
      'initialPayment',
      'months',
      'tanPercent',
      'quotedMonthlyPayment',
      'buyout',
      'upfrontFees',
      'monthlyFee',
      'quotedTaegPercent',
    ]) ||
    !isBool(leasing.returnOptionEnabled) ||
    !isNum(leasing.returnFees)
  ) {
    return null
  }

  return value as unknown as SimulationState
}

export function loadSimulation(): SimulationState | null {
  try {
    const raw = window.localStorage.getItem(SIMULATION_KEY)
    if (raw === null) return null
    return parseSimulation(JSON.parse(raw))
  } catch {
    return null
  }
}

export function saveSimulation(state: SimulationState): void {
  try {
    window.localStorage.setItem(SIMULATION_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable
  }
}

export function loadBaseline(): SimulationState | null {
  try {
    const raw = window.localStorage.getItem(BASELINE_KEY)
    if (raw === null) return null
    return parseSimulation(JSON.parse(raw))
  } catch {
    return null
  }
}

export function saveBaseline(state: SimulationState): void {
  try {
    window.localStorage.setItem(BASELINE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable
  }
}

export function removeBaseline(): void {
  try {
    window.localStorage.removeItem(BASELINE_KEY)
  } catch {
    // storage unavailable
  }
}
