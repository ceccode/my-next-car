import { solveMonthlyRate } from './rate'
import type { Cents, SimulationState } from './types'

export const MESSAGES = {
  listPrice: "Inserisci un prezzo del veicolo maggiore di zero.",
  incentivesExceedPrice: "Sconti e incentivi superano il prezzo del veicolo.",
  negativeAmounts: "Gli importi non possono essere negativi.",
  months: "La durata deve essere compresa tra 6 e 120 mesi.",
  tan: "Il TAN deve essere compreso tra 0% e 30%.",
  nothingToFinance: "Anticipo e permuta superano il prezzo: non c'è nulla da finanziare.",
  zeroToFinance: "L'importo da finanziare è zero: si tratta di un acquisto in contanti.",
  finalPaymentTooHigh: "Il pagamento finale non può superare l'importo finanziato.",
  quotedMonthlyPayment: "Inserisci il canone mensile del preventivo.",
  quotedPaymentsTooLow:
    "I pagamenti del preventivo sono inferiori all'importo finanziato. Controlla canone mensile, anticipo e riscatto.",
} as const

function moneyInputs(state: SimulationState): number[] {
  const a = state.acquisition
  const s = state.shared
  const l = state.loan
  const b = state.balloon
  const e = state.leasing
  return [
    a.listPrice, a.discount, a.scrappageIncentive, a.otherIncentives, a.additionalCosts,
    a.tradeInValue, a.tradeInOutstandingLoan,
    s.downPayment, s.months, s.tanPercent, s.upfrontFees, s.monthlyFee,
    l.downPayment, l.months, l.tanPercent, l.upfrontFees, l.monthlyFee, l.quotedTaegPercent,
    b.downPayment, b.months, b.tanPercent, b.upfrontFees, b.monthlyFee, b.quotedTaegPercent,
    b.balloonPayment, b.returnFees,
    e.initialPayment, e.months, e.tanPercent, e.quotedMonthlyPayment,
    e.buyout, e.upfrontFees, e.monthlyFee, e.quotedTaegPercent, e.returnFees,
  ]
}

export function validateGlobal(state: SimulationState, netPurchasePrice: Cents): string[] {
  const errors: string[] = []
  if (state.acquisition.listPrice <= 0) errors.push(MESSAGES.listPrice)
  if (netPurchasePrice < 0) errors.push(MESSAGES.incentivesExceedPrice)
  if (moneyInputs(state).some((x) => x < 0 || !Number.isFinite(x))) errors.push(MESSAGES.negativeAmounts)
  return errors
}

export interface FinancedValidation {
  P: Cents
  months: number
  tanPercent: number
  checkTan: boolean
  finalPayment: Cents
  hasFinalPayment: boolean
  quotedMonthlyPayment: Cents | null
}

export function validateFinanced(v: FinancedValidation): string[] {
  const errors: string[] = []
  if (!Number.isInteger(v.months) || v.months < 6 || v.months > 120) errors.push(MESSAGES.months)
  if (v.checkTan && (v.tanPercent < 0 || v.tanPercent > 30 || !Number.isFinite(v.tanPercent))) {
    errors.push(MESSAGES.tan)
  }
  if (v.P < 0) errors.push(MESSAGES.nothingToFinance)
  if (v.P === 0) errors.push(MESSAGES.zeroToFinance)
  if (v.hasFinalPayment && v.finalPayment > v.P) errors.push(MESSAGES.finalPaymentTooHigh)
  if (v.quotedMonthlyPayment !== null) {
    if (v.quotedMonthlyPayment <= 0) {
      errors.push(MESSAGES.quotedMonthlyPayment)
    } else if (v.P > 0) {
      const payments = new Array<Cents>(v.months).fill(v.quotedMonthlyPayment)
      payments[v.months - 1] += v.finalPayment
      if (solveMonthlyRate(v.P, payments) === null) errors.push(MESSAGES.quotedPaymentsTooLow)
    }
  }
  return errors
}
