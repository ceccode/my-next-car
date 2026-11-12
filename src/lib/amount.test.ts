import { describe, expect, it } from 'vitest'
import { formatAmount, parseAmount } from './amount'

describe('parseAmount', () => {
  it.each([
    ['46.990', 46990],
    ['46990', 46990],
    ['7,49', 7.49],
    ['1.234,5', 1234.5],
    ['€ 12.000', 12000],
    ['', 0],
    ['abc', 0],
  ])('reads %j as %d', (text, expected) => {
    expect(parseAmount(text)).toBe(expected)
  })
})

describe('formatAmount', () => {
  it('groups thousands Italian style, even for four digits', () => {
    expect(formatAmount(7952)).toBe('7.952')
  })

  it('rounds whole amounts', () => {
    expect(formatAmount(46990.4)).toBe('46.990')
  })

  it('keeps up to two decimals when asked', () => {
    expect(formatAmount(7.49, { decimals: true })).toBe('7,49')
  })
})
