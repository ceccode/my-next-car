import { computeAcquisition, toCents } from './acquisition'
import { buildSchedule, computeInstallment, type ScheduleRow } from './amortization'
import { solveMonthlyRate } from './rate'
import { validateFinanced, validateGlobal } from './validation'
import type {
  Cents,
  CashResult,
  ComparisonResult,
  FinancedKind,
  FinancedResult,
  MethodInvalid,
  MethodKind,
  SimulationState,
} from './types'

export function compareTaeg(estimated: number | null, quoted: number): 'none' | 'aligned' | 'higher' | 'lower' {
  if (quoted <= 0 || estimated === null) return 'none'
  if (Math.abs(quoted - estimated) <= 0.3) return 'aligned'
  if (quoted > estimated + 0.3) return 'higher'
  return 'lower'
}

export function estimateTaegPercent(
  principal: Cents,
  upfrontFees: Cents,
  schedule: ScheduleRow[],
  monthlyFee: Cents,
  finalPayment: Cents,
): number | null {
  const payments = schedule.map((row) => row.payment + monthlyFee)
  payments[payments.length - 1] += finalPayment
  const i = solveMonthlyRate(principal - upfrontFees, payments)
  if (i === null) return null
  return (Math.pow(1 + i, 12) - 1) * 100
}

interface FinancedSpec {
  kind: FinancedKind
  D: Cents
  months: number
  tanPercent: number
  U: Cents
  F: Cents
  B: Cents
  quoted: boolean
  quotedMonthlyPayment: Cents
  quotedTaegPercent: number
  returnOptionEnabled: boolean
  returnFees: Cents
}

function computeFinanced(kind: FinancedKind, N: Cents, E: Cents, spec: FinancedSpec): FinancedResult | MethodInvalid {
  const { D, months, tanPercent, U, F, B, quotedMonthlyPayment, quotedTaegPercent, returnOptionEnabled, returnFees } = spec
  const P = N - E - D
  const errors = validateFinanced({
    P,
    months,
    tanPercent,
    checkTan: !spec.quoted,
    finalPayment: B,
    hasFinalPayment: kind !== 'loan',
    quotedMonthlyPayment: spec.quoted ? quotedMonthlyPayment : null,
  })
  if (errors.length > 0) return { kind, valid: false, errors }

  let schedule: ScheduleRow[]
  let monthlyInstallment: Cents
  let nominalRatePercent: number
  let nominalRateIsEstimated: boolean

  if (spec.quoted) {
    const M = quotedMonthlyPayment
    const r = solveMonthlyRate(P, [
      ...Array.from({ length: months - 1 }, () => M),
      M + B,
    ]) as number
    nominalRatePercent = r * 12 * 100
    nominalRateIsEstimated = true
    monthlyInstallment = M
    schedule = []
    let balance = P
    for (let month = 1; month <= months; month++) {
      let interest: number
      let principal: number
      if (month === months) {
        principal = balance - B
        interest = M - principal
      } else {
        interest = Math.round(balance * r)
        principal = M - interest
      }
      balance -= principal
      schedule.push({ month, payment: M, interest, principal, balance })
    }
  } else {
    schedule = buildSchedule(P, B, months, tanPercent)
    monthlyInstallment = computeInstallment(P, B, months, tanPercent)
    nominalRatePercent = tanPercent
    nominalRateIsEstimated = false
  }

  const totalInterest = schedule.reduce((s, row) => s + row.interest, 0)
  const totalInstallments = schedule.reduce((s, row) => s + row.payment, 0)
  const totalFees = U + months * F
  const initialCash = D + U
  const totalEconomicCost = N + totalInterest + totalFees
  const totalCashPaid = N - E + totalInterest + totalFees

  return {
    kind,
    valid: true,
    principal: P,
    months,
    monthlyInstallment,
    monthlyFee: F,
    monthlyOutflow: monthlyInstallment + F,
    finalPayment: B,
    initialCash,
    totalInstallments,
    totalInterest,
    totalFees,
    totalEconomicCost,
    totalCashPaid,
    extraCostVsCash: totalInterest + totalFees,
    nominalRatePercent,
    nominalRateIsEstimated,
    estimatedTaegPercent: estimateTaegPercent(P, U, schedule, F, B),
    quotedTaegPercent,
    taegComparison: compareTaeg(estimateTaegPercent(P, U, schedule, F, B), quotedTaegPercent),
    schedule,
    returnOptionEnabled,
    costIfReturned: returnOptionEnabled ? initialCash + totalInstallments + months * F + returnFees : null,
    ownerDuringContract: kind !== 'leasing',
  }
}

function invalid(kind: MethodKind, errors: string[]): MethodInvalid {
  return { kind, valid: false, errors }
}

export function computeComparison(state: SimulationState): ComparisonResult {
  const { netPurchasePrice: N, tradeInEquity: E } = computeAcquisition(state)
  const globalErrors = validateGlobal(state, N)

  let cash: CashResult | MethodInvalid
  if (globalErrors.length > 0) {
    cash = invalid('cash', globalErrors)
  } else {
    cash = {
      kind: 'cash',
      valid: true,
      initialCash: N - E,
      totalInterest: 0,
      totalFees: 0,
      totalEconomicCost: N,
      totalCashPaid: N - E,
      extraCostVsCash: 0,
    }
  }

  const ifGlobal = (kind: MethodKind) => (globalErrors.length > 0 ? invalid(kind, globalErrors) : null)

  const loan =
    ifGlobal('loan') ??
    computeFinanced('loan', N, E, {
      kind: 'loan',
      D: toCents(state.loan.downPayment),
      months: state.loan.months,
      tanPercent: state.loan.tanPercent,
      U: toCents(state.loan.upfrontFees),
      F: toCents(state.loan.monthlyFee),
      B: 0,
      quoted: false,
      quotedMonthlyPayment: 0,
      quotedTaegPercent: state.loan.quotedTaegPercent,
      returnOptionEnabled: false,
      returnFees: 0,
    })

  const balloon =
    ifGlobal('balloon') ??
    computeFinanced('balloon', N, E, {
      kind: 'balloon',
      D: toCents(state.balloon.downPayment),
      months: state.balloon.months,
      tanPercent: state.balloon.tanPercent,
      U: toCents(state.balloon.upfrontFees),
      F: toCents(state.balloon.monthlyFee),
      B: toCents(state.balloon.balloonPayment),
      quoted: false,
      quotedMonthlyPayment: 0,
      quotedTaegPercent: state.balloon.quotedTaegPercent,
      returnOptionEnabled: state.balloon.returnOptionEnabled,
      returnFees: toCents(state.balloon.returnFees),
    })

  const leasing =
    ifGlobal('leasing') ??
    computeFinanced('leasing', N, E, {
      kind: 'leasing',
      D: toCents(state.leasing.initialPayment),
      months: state.leasing.months,
      tanPercent: state.leasing.tanPercent,
      U: toCents(state.leasing.upfrontFees),
      F: toCents(state.leasing.monthlyFee),
      B: toCents(state.leasing.buyout),
      quoted: state.leasing.mode === 'quoted',
      quotedMonthlyPayment: toCents(state.leasing.quotedMonthlyPayment),
      quotedTaegPercent: state.leasing.quotedTaegPercent,
      returnOptionEnabled: state.leasing.returnOptionEnabled,
      returnFees: toCents(state.leasing.returnFees),
    })

  const financed: (FinancedResult | MethodInvalid)[] = [loan, balloon, leasing]
  const validFinanced = financed.filter((m): m is FinancedResult => m.valid)

  const minOf = (values: number[]) => (values.length === 0 ? null : Math.min(...values))
  const minCost = minOf(validFinanced.map((m) => m.totalEconomicCost))
  const minMonthly = minOf(validFinanced.map((m) => m.monthlyOutflow))
  const minInitial = minOf(validFinanced.map((m) => m.initialCash))

  const allMethods: (CashResult | FinancedResult)[] = [
    ...(cash.valid ? [cash] : []),
    ...validFinanced,
  ]
  const minTotal = minOf(allMethods.map((m) => m.totalEconomicCost))

  return {
    netPurchasePrice: N,
    tradeInEquity: E,
    globalErrors,
    cash,
    loan,
    balloon,
    leasing,
    lowestCostKinds:
      minTotal === null
        ? []
        : (allMethods
            .filter((m) => m.totalEconomicCost === minTotal)
            .map((m) => m.kind) as MethodKind[]),
    lowestCostFinancedKinds:
      minCost === null ? [] : (validFinanced.filter((m) => m.totalEconomicCost === minCost).map((m) => m.kind) as FinancedKind[]),
    lowestMonthlyKinds:
      minMonthly === null ? [] : (validFinanced.filter((m) => m.monthlyOutflow === minMonthly).map((m) => m.kind) as FinancedKind[]),
    lowestInitialCashKinds:
      minInitial === null ? [] : (validFinanced.filter((m) => m.initialCash === minInitial).map((m) => m.kind) as FinancedKind[]),
  }
}
