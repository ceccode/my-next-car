import { describe, expect, it } from 'vitest'
import { exampleScenario } from '@/data/exampleScenario'
import { compareTaeg, computeComparison } from './comparison'
import type { FinancedResult, MethodInvalid, SimulationState } from './types'

const E = (euros: number) => Math.round(euros * 100)

function leasingQuotedState(quotedMonthlyPayment: number): SimulationState {
  return {
    ...exampleScenario,
    acquisition: { ...exampleScenario.acquisition, listPrice: 35300 },
    leasing: {
      ...exampleScenario.leasing,
      mode: 'quoted',
      initialPayment: 0,
      months: 60,
      quotedMonthlyPayment,
      buyout: 14669,
      upfrontFees: 0,
      monthlyFee: 0,
    },
  }
}

describe('T6. Leasing, quoted mode', () => {
  it('(a) quoted 504.86: implied TAN 7.49, total interest 9,660.60, final balance 14,669.00', () => {
    const result = computeComparison(leasingQuotedState(504.86))
    const m = result.leasing
    if (!m.valid) throw new Error(`leasing invalid: ${m.errors.join(', ')}`)
    expect(m.nominalRatePercent).toBeCloseTo(7.49, 1)
    expect(m.nominalRateIsEstimated).toBe(true)
    expect(m.totalInterest).toBe(E(9660.6))
    expect(m.schedule[59].balance).toBe(E(14669))
  })

  it('(b) quoted 450.00: implied TAN 4.98, total interest 6,369.00', () => {
    const result = computeComparison(leasingQuotedState(450))
    const m = result.leasing
    if (!m.valid) throw new Error(`leasing invalid: ${m.errors.join(', ')}`)
    expect(m.nominalRatePercent).toBeCloseTo(4.98, 1)
    expect(m.totalInterest).toBe(E(6369))
  })

  it('(c) quoted 300.00: method invalid (payments total less than principal)', () => {
    const result = computeComparison(leasingQuotedState(300))
    const m = result.leasing
    if (m.valid) throw new Error('leasing should be invalid')
    expect(m.errors).toEqual([
      "I pagamenti del preventivo sono inferiori all'importo finanziato. Controlla canone mensile, anticipo e riscatto.",
    ])
  })
})

describe('T9. Full example scenario', () => {
  const result = computeComparison(exampleScenario)

  it('net purchase price 46,990.00 and equity 0', () => {
    expect(result.netPurchasePrice).toBe(E(46990))
    expect(result.tradeInEquity).toBe(0)
    expect(result.globalErrors).toEqual([])
  })

  it('cash total cost is 46,990.00', () => {
    if (!result.cash.valid) throw new Error('cash invalid')
    expect(result.cash.totalEconomicCost).toBe(E(46990))
  })

  const expectFinanced = (m: FinancedResult | MethodInvalid, expected: Record<string, number | string | null>) => {
    if (!m.valid) throw new Error(`invalid: ${m.errors.join(', ')}`)
    const r = m as FinancedResult
    for (const [key, value] of Object.entries(expected)) {
      expect(r[key as keyof FinancedResult]).toBe(value)
    }
  }

  it('loan values', () => {
    expectFinanced(result.loan, {
      principal: E(36990),
      monthlyInstallment: E(741.03),
      monthlyOutflow: E(744.03),
      finalPayment: 0,
      initialCash: E(10300),
      totalInterest: E(7471.66),
      totalFees: E(480),
      totalEconomicCost: E(54941.66),
      extraCostVsCash: E(7951.66),
    })
    expect(result.loan.valid && (result.loan as FinancedResult).schedule[59].payment).toBe(E(740.89))
    if (result.loan.valid) expect((result.loan as FinancedResult).estimatedTaegPercent as number).toBeCloseTo(8.31, 1)
  })

  it('balloon values', () => {
    const b = result.balloon
    expectFinanced(b, {
      principal: E(38990),
      monthlyInstallment: E(540.06),
      monthlyOutflow: E(543.06),
      finalPayment: E(17477),
      initialCash: E(8300),
      totalInterest: E(10890.59),
      totalFees: E(480),
      totalEconomicCost: E(58360.59),
      extraCostVsCash: E(11370.59),
    })
    if (b.valid) {
      expect(b.schedule[59].payment).toBe(E(540.05))
      expect(b.estimatedTaegPercent as number).toBeCloseTo(8.14, 1)
    }
  })

  it('leasing values', () => {
    const l = result.leasing
    expectFinanced(l, {
      principal: E(37290),
      monthlyInstallment: E(544.73),
      monthlyOutflow: E(547.73),
      finalPayment: E(14669),
      initialCash: E(10000),
      totalInterest: E(10062.78),
      totalFees: E(480),
      totalEconomicCost: E(57532.78),
      extraCostVsCash: E(10542.78),
    })
    if (l.valid) {
      expect(l.schedule[59].payment).toBe(E(544.71))
      expect(l.estimatedTaegPercent as number).toBeCloseTo(8.18, 1)
    }
  })

  it('lowest kinds', () => {
    expect(result.lowestCostKinds).toEqual(['cash'])
    expect(result.lowestCostFinancedKinds).toEqual(['loan'])
    expect(result.lowestMonthlyKinds).toEqual(['balloon'])
    expect(result.lowestInitialCashKinds).toEqual(['balloon'])
  })

  it('costIfReturned with return option and 500 fees is 41,383.59', () => {
    const s: SimulationState = {
      ...exampleScenario,
      balloon: { ...exampleScenario.balloon, returnOptionEnabled: true, returnFees: 500 },
    }
    const m = computeComparison(s).balloon
    if (!m.valid) throw new Error('balloon invalid')
    expect(m.costIfReturned).toBe(E(41383.59))
  })
})

describe('T10. Invariants', () => {
  const invariants = (label: string, m: FinancedResult) => {
    expect(
      m.initialCash + m.totalInstallments + m.months * m.monthlyFee + m.finalPayment,
      `${label}: cash identity`,
    ).toBe(m.totalCashPaid)
    expect(m.schedule.reduce((s, r) => s + r.principal, 0), `${label}: principal column`).toBe(m.principal - m.finalPayment)
    expect(m.schedule[m.months - 1].balance, `${label}: last balance`).toBe(m.finalPayment)
  }

  it('hold for the T8(c) loan and for every valid method in T9', () => {
    const result = computeComparison(exampleScenario)
    for (const kind of ['loan', 'balloon', 'leasing'] as const) {
      const m = result[kind]
      if (!m.valid) throw new Error(`${kind} invalid`)
      invariants(kind, m)
    }
  })
})

describe('T12. TAEG comparison', () => {
  it('compareTaeg cases', () => {
    expect(compareTaeg(8.31, 0)).toBe('none')
    expect(compareTaeg(null, 9)).toBe('none')
    expect(compareTaeg(8.31, 8.4)).toBe('aligned')
    expect(compareTaeg(8.31, 9.2)).toBe('higher')
    expect(compareTaeg(8.31, 7.5)).toBe('lower')
  })
})
