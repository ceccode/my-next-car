import type { ScheduleRow } from './amortization'

export type Cents = number

export interface SimulationState {
  schemaVersion: 1
  vehicle: {
    name: string
    type: 'electric' | 'hybrid' | 'combustion' | 'other'
    condition: 'new' | 'used'
  }
  acquisition: {
    listPrice: number
    discount: number
    scrappageIncentive: number
    otherIncentives: number
    additionalCosts: number
    tradeInValue: number
    tradeInOutstandingLoan: number
  }
  shared: { downPayment: number; months: number; tanPercent: number; upfrontFees: number; monthlyFee: number }
  loan: {
    downPayment: number; months: number; tanPercent: number; upfrontFees: number; monthlyFee: number
    quotedTaegPercent: number
  }
  balloon: {
    downPayment: number; months: number; tanPercent: number; upfrontFees: number; monthlyFee: number
    quotedTaegPercent: number
    balloonPayment: number; returnOptionEnabled: boolean; returnFees: number
  }
  leasing: {
    mode: 'calculated' | 'quoted'
    initialPayment: number; months: number; tanPercent: number; quotedMonthlyPayment: number
    buyout: number; upfrontFees: number; monthlyFee: number
    quotedTaegPercent: number
    returnOptionEnabled: boolean; returnFees: number
  }
}

export type MethodKind = 'cash' | 'loan' | 'balloon' | 'leasing'
export type FinancedKind = 'loan' | 'balloon' | 'leasing'

export interface MethodInvalid { kind: MethodKind; valid: false; errors: string[] }

export interface CashResult {
  kind: 'cash'; valid: true
  initialCash: Cents; totalInterest: 0; totalFees: 0
  totalEconomicCost: Cents; totalCashPaid: Cents; extraCostVsCash: 0
}

export interface FinancedResult {
  kind: FinancedKind; valid: true
  principal: Cents; months: number
  monthlyInstallment: Cents; monthlyFee: Cents; monthlyOutflow: Cents
  finalPayment: Cents; initialCash: Cents
  totalInstallments: Cents; totalInterest: Cents; totalFees: Cents
  totalEconomicCost: Cents; totalCashPaid: Cents; extraCostVsCash: Cents
  nominalRatePercent: number
  nominalRateIsEstimated: boolean
  estimatedTaegPercent: number | null
  quotedTaegPercent: number
  taegComparison: 'none' | 'aligned' | 'higher' | 'lower'
  schedule: ScheduleRow[]
  returnOptionEnabled: boolean; costIfReturned: Cents | null
  ownerDuringContract: boolean
}

export interface ComparisonResult {
  netPurchasePrice: Cents; tradeInEquity: Cents
  globalErrors: string[]
  cash: CashResult | MethodInvalid
  loan: FinancedResult | MethodInvalid
  balloon: FinancedResult | MethodInvalid
  leasing: FinancedResult | MethodInvalid
  lowestCostKinds: MethodKind[]
  lowestCostFinancedKinds: FinancedKind[]
  lowestMonthlyKinds: FinancedKind[]
  lowestInitialCashKinds: FinancedKind[]
}
