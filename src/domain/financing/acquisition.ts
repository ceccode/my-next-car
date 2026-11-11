import type { Cents, SimulationState } from './types'

export function toCents(x: number): Cents {
  return Math.round(x * 100)
}

export interface Acquisition {
  netPurchasePrice: Cents
  tradeInEquity: Cents
}

export function computeAcquisition(state: SimulationState): Acquisition {
  const a = state.acquisition
  const netPurchasePrice =
    toCents(a.listPrice) -
    toCents(a.discount) -
    toCents(a.scrappageIncentive) -
    toCents(a.otherIncentives) +
    toCents(a.additionalCosts)
  const tradeInEquity = toCents(a.tradeInValue) - toCents(a.tradeInOutstandingLoan)
  return { netPurchasePrice, tradeInEquity }
}
