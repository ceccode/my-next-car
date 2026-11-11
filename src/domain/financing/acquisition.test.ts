import { describe, expect, it } from 'vitest'
import { computeAcquisition } from './acquisition'
import { buildSchedule, computeInstallment } from './amortization'
import { estimateTaegPercent } from './comparison'
import type { SimulationState } from './types'

const E = (euros: number) => Math.round(euros * 100)

function stateWith(overrides: {
  listPrice: number
  discount?: number
  scrappageIncentive?: number
  otherIncentives?: number
  additionalCosts?: number
  tradeInValue?: number
  tradeInOutstandingLoan?: number
}): SimulationState {
  return {
    schemaVersion: 1,
    vehicle: { name: '', type: 'other', condition: 'new' },
    acquisition: {
      listPrice: overrides.listPrice,
      discount: overrides.discount ?? 0,
      scrappageIncentive: overrides.scrappageIncentive ?? 0,
      otherIncentives: overrides.otherIncentives ?? 0,
      additionalCosts: overrides.additionalCosts ?? 0,
      tradeInValue: overrides.tradeInValue ?? 0,
      tradeInOutstandingLoan: overrides.tradeInOutstandingLoan ?? 0,
    },
    shared: { downPayment: 0, months: 48, tanPercent: 5, upfrontFees: 0, monthlyFee: 0 },
    loan: { downPayment: 0, months: 48, tanPercent: 5, upfrontFees: 0, monthlyFee: 0, quotedTaegPercent: 0 },
    balloon: {
      downPayment: 0, months: 48, tanPercent: 5, upfrontFees: 0, monthlyFee: 0,
      quotedTaegPercent: 0, balloonPayment: 0, returnOptionEnabled: false, returnFees: 0,
    },
    leasing: {
      mode: 'calculated', initialPayment: 0, months: 48, tanPercent: 5, quotedMonthlyPayment: 0,
      buyout: 0, upfrontFees: 0, monthlyFee: 0, quotedTaegPercent: 0,
      returnOptionEnabled: false, returnFees: 0,
    },
  }
}

describe('T8. Acquisition and trade-in', () => {
  const base = {
    listPrice: 30000,
    discount: 1500,
    scrappageIncentive: 2000,
    otherIncentives: 500,
    additionalCosts: 800,
  }

  it('net purchase price is 26,800.00', () => {
    const { netPurchasePrice } = computeAcquisition(stateWith(base))
    expect(netPurchasePrice).toBe(E(26800))
  })

  it('(a) equity 5,000: cash purchase initial cash 21,800.00, total cost 26,800.00, total cash paid 21,800.00', () => {
    const s = stateWith({ ...base, tradeInValue: 8000, tradeInOutstandingLoan: 3000 })
    const { netPurchasePrice: N, tradeInEquity: Eq } = computeAcquisition(s)
    expect(Eq).toBe(E(5000))
    expect(N - Eq).toBe(E(21800))
    expect(N).toBe(E(26800))
    expect(N - Eq).toBe(E(21800))
  })

  it('(b) equity -2,500: cash purchase initial cash 29,300.00, total cost 26,800.00', () => {
    const s = stateWith({ ...base, tradeInValue: 5000, tradeInOutstandingLoan: 7500 })
    const { netPurchasePrice: N, tradeInEquity: Eq } = computeAcquisition(s)
    expect(Eq).toBe(-E(2500))
    expect(N - Eq).toBe(E(29300))
    expect(N).toBe(E(26800))
  })

  it('(c) loan on negative equity: all financed quantities', () => {
    const s = stateWith({ ...base, tradeInValue: 5000, tradeInOutstandingLoan: 7500 })
    const { netPurchasePrice: N, tradeInEquity: Eq } = computeAcquisition(s)
    const D = E(4000)
    const n = 48
    const tan = 5
    const U = E(200)
    const F = E(2)
    const P = N - Eq - D
    const M = computeInstallment(P, 0, n, tan)
    const rows = buildSchedule(P, 0, n, tan)

    expect(P).toBe(E(25300))
    expect(M).toBe(E(582.64))
    expect(rows[n - 1].payment).toBe(E(582.7))
    const totalInterest = rows.reduce((sum, r) => sum + r.interest, 0)
    expect(totalInterest).toBe(E(2666.78))
    const totalFees = U + n * F
    expect(totalFees).toBe(E(296))
    expect(D + U).toBe(E(4200))
    expect(N + totalInterest + totalFees).toBe(E(29762.78))
    expect(N - Eq + totalInterest + totalFees).toBe(E(32262.78))
    const taeg = estimateTaegPercent(P, U, rows, F, 0)
    expect(taeg).not.toBeNull()
    expect(taeg as number).toBeCloseTo(5.72, 1)
  })
})
