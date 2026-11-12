import { describe, expect, it } from 'vitest'
import { exampleScenario } from '@/data/exampleScenario'
import { computeComparison } from '@/domain/financing/comparison'
import type { SimulationState } from '@/domain/financing/types'
import { withCommonTerms } from '@/domain/scenario/scenario'
import { barScale, keyInsight, rankByTotalCost } from './summary'

const starter = (): SimulationState => withCommonTerms(structuredClone(exampleScenario), {})
const summaryOf = (state: SimulationState) => computeComparison(state)

describe('rankByTotalCost', () => {
  it('orders the options from the cheapest total cost', () => {
    const totals = rankByTotalCost(summaryOf(starter())).map((o) => (o.available ? o.total : Infinity))
    expect(totals).toEqual([...totals].sort((a, b) => a - b))
  })

  it('puts cash first, since financing always adds interest or fees', () => {
    expect(rankByTotalCost(summaryOf(starter()))[0].kind).toBe('cash')
  })

  it('reports no monthly payment for cash', () => {
    const cash = rankByTotalCost(summaryOf(starter())).find((o) => o.kind === 'cash')
    expect(cash).toMatchObject({ available: true, monthly: null })
  })

  it('moves options that cannot be computed to the end', () => {
    const state = starter()
    state.balloon.balloonPayment = 999_999
    const options = rankByTotalCost(summaryOf(state))
    expect(options.at(-1)).toEqual({ kind: 'balloon', available: false })
  })
})

describe('keyInsight', () => {
  it('warns when the lowest monthly payment costs more overall', () => {
    const insight = keyInsight(summaryOf(starter()))
    expect(insight).toMatchObject({ kind: 'lowestMonthlyCostsMore', method: 'balloon', versus: 'loan' })
    if (insight?.kind === 'lowestMonthlyCostsMore') expect(insight.overpay).toBeGreaterThan(0)
  })

  it('otherwise states what the cheapest financing costs over cash', () => {
    const state = starter()
    state.balloon.balloonPayment = 999_999
    state.leasing.buyout = 999_999
    const result = summaryOf(state)
    expect(keyInsight(result)).toEqual({
      kind: 'financingPremium',
      method: 'loan',
      premium: result.loan.valid ? result.loan.extraCostVsCash : NaN,
    })
  })

  it('has nothing to say when no financing can be computed', () => {
    const state = starter()
    state.acquisition.listPrice = 0
    expect(keyInsight(summaryOf(state))).toBeNull()
  })
})

describe('barScale', () => {
  it('is anchored to the price, so it does not move when only the terms change', () => {
    expect(barScale(4_699_000, [4_699_000, 5_494_166])).toBe(8_000_000)
  })

  it('grows to fit a total beyond the anchor', () => {
    expect(barScale(4_699_000, [8_100_000])).toBe(9_000_000)
  })

  it('is never zero', () => {
    expect(barScale(0, [])).toBeGreaterThan(0)
  })
})
