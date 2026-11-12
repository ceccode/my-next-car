import { describe, expect, it } from 'vitest'
import { exampleScenario } from '@/data/exampleScenario'
import type { SimulationState } from '@/domain/financing/types'
import { countAdjustments, maxDownPayment, withCommonTerms, withListPrice } from './scenario'

const example = (): SimulationState => structuredClone(exampleScenario)

describe('withListPrice', () => {
  it('sets the list price', () => {
    expect(withListPrice(example(), 30000).acquisition.listPrice).toBe(30000)
  })

  it('scales balloon and buyout with the price so they stay plausible', () => {
    const state = example()
    const halved = withListPrice(state, state.acquisition.listPrice / 2)
    expect(halved.balloon.balloonPayment).toBe(Math.round(state.balloon.balloonPayment / 2))
    expect(halved.leasing.buyout).toBe(Math.round(state.leasing.buyout / 2))
  })

  it('leaves balloon and buyout alone when the old price is zero', () => {
    const state = example()
    state.acquisition.listPrice = 0
    const next = withListPrice(state, 20000)
    expect(next.balloon.balloonPayment).toBe(state.balloon.balloonPayment)
    expect(next.leasing.buyout).toBe(state.leasing.buyout)
  })

  it('does not mutate the given state', () => {
    const state = example()
    withListPrice(state, 1)
    expect(state).toEqual(exampleScenario)
  })
})

describe('withCommonTerms', () => {
  it('applies a common term to every financed method', () => {
    const next = withCommonTerms(example(), { months: 48 })
    expect([next.shared.months, next.loan.months, next.balloon.months, next.leasing.months]).toEqual([48, 48, 48, 48])
  })

  it('maps the down payment to the leasing initial payment', () => {
    const next = withCommonTerms(example(), { downPayment: 5000 })
    expect(next.leasing.initialPayment).toBe(5000)
    expect(next.balloon.downPayment).toBe(5000)
  })

  it('keeps the terms that belong to a single method', () => {
    const state = example()
    const next = withCommonTerms(state, { tanPercent: 3 })
    expect(next.balloon.balloonPayment).toBe(state.balloon.balloonPayment)
    expect(next.leasing.mode).toBe(state.leasing.mode)
  })

  it('with no changes, aligns every method to the shared terms', () => {
    const next = withCommonTerms(example(), {})
    expect(next.balloon.downPayment).toBe(exampleScenario.shared.downPayment)
    expect(next.leasing.initialPayment).toBe(exampleScenario.shared.downPayment)
  })
})

describe('countAdjustments', () => {
  it('counts the optional amounts the user filled in', () => {
    const state = example()
    state.shared.upfrontFees = 0
    state.shared.monthlyFee = 0
    expect(countAdjustments(state)).toBe(0)
    state.acquisition.discount = 1000
    state.acquisition.tradeInValue = 8000
    expect(countAdjustments(state)).toBe(2)
  })
})

describe('maxDownPayment', () => {
  it('keeps 10% of the price financed, on the slider step', () => {
    expect(maxDownPayment({ netPurchasePrice: 4_699_000, tradeInEquity: 0 })).toBe(42_000)
  })

  it('subtracts a positive trade-in', () => {
    expect(maxDownPayment({ netPurchasePrice: 4_000_000, tradeInEquity: 1_000_000 })).toBe(27_000)
  })

  it('ignores a trade-in worth less than its debt', () => {
    expect(maxDownPayment({ netPurchasePrice: 4_000_000, tradeInEquity: -500_000 })).toBe(36_000)
  })

  it('always leaves the slider some room', () => {
    expect(maxDownPayment({ netPurchasePrice: 0, tradeInEquity: 0 })).toBe(1_000)
  })
})
