import type { Cents, ComparisonResult, SimulationState } from '@/domain/financing/types'

/** The terms every financed method shares: changing one changes all of them. */
export type CommonTerms = SimulationState['shared']

/**
 * Sets the list price. Balloon and buyout are scaled by the same ratio, because a
 * final payment that fit the old price would be implausible, or invalid, for the new one.
 */
export function withListPrice(state: SimulationState, listPrice: number): SimulationState {
  const previous = state.acquisition.listPrice
  const scale = (amount: number) => (previous > 0 ? Math.round((amount * listPrice) / previous) : amount)
  return {
    ...state,
    acquisition: { ...state.acquisition, listPrice },
    balloon: { ...state.balloon, balloonPayment: scale(state.balloon.balloonPayment) },
    leasing: { ...state.leasing, buyout: scale(state.leasing.buyout) },
  }
}

export function withCommonTerms(state: SimulationState, changes: Partial<CommonTerms>): SimulationState {
  const shared = { ...state.shared, ...changes }
  const { downPayment, ...terms } = shared
  return {
    ...state,
    shared,
    loan: { ...state.loan, ...terms, downPayment },
    balloon: { ...state.balloon, ...terms, downPayment },
    leasing: { ...state.leasing, ...terms, initialPayment: downPayment },
  }
}

/** How many optional amounts (discounts, trade-in, fees) the user has filled in. */
export function countAdjustments(state: SimulationState): number {
  const { discount, scrappageIncentive, otherIncentives, additionalCosts, tradeInValue } = state.acquisition
  const { upfrontFees, monthlyFee } = state.shared
  return [discount, scrappageIncentive, otherIncentives, additionalCosts, tradeInValue, upfrontFees, monthlyFee].filter(
    (amount) => amount > 0,
  ).length
}

export const DOWN_PAYMENT_STEP = 500

/**
 * The largest down payment worth offering, in euros: at least 10% of what is left to pay
 * stays financed, rounded down to the slider step.
 */
export function maxDownPayment({ netPurchasePrice, tradeInEquity }: Pick<ComparisonResult, 'netPurchasePrice' | 'tradeInEquity'>): number {
  const leftToPay: Cents = Math.max(0, netPurchasePrice - Math.max(0, tradeInEquity))
  const ceiling = (leftToPay / 100) * 0.9
  return Math.max(DOWN_PAYMENT_STEP * 2, Math.floor(ceiling / DOWN_PAYMENT_STEP) * DOWN_PAYMENT_STEP)
}
