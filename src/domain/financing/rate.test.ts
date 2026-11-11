import { describe, expect, it } from 'vitest'
import { solveMonthlyRate } from './rate'

const E = (euros: number) => Math.round(euros * 100)

describe('T7. Rate solver', () => {
  it('monthly rate of 12 equal payments of 860.66 on 10,000 implies TAN 6.00', () => {
    const r = solveMonthlyRate(E(10000), Array(12).fill(E(860.66)))
    expect(r).not.toBeNull()
    expect((r as number) * 1200).toBeCloseTo(6.0, 1)
  })

  it('payments whose sum is lower than the amount return null', () => {
    expect(solveMonthlyRate(E(10000), Array(12).fill(E(800)))).toBeNull()
  })

  it('payments whose sum equals the amount return 0', () => {
    expect(solveMonthlyRate(E(12000), Array(12).fill(E(1000)))).toBe(0)
  })
})
