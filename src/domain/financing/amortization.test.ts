import { describe, expect, it } from 'vitest'
import { buildSchedule, computeInstallment } from './amortization'

const E = (euros: number) => Math.round(euros * 100)

describe('T1. Standard loan', () => {
  const P = E(35000)
  const B = 0
  const n = 60
  const tan = 7.49
  const M = computeInstallment(P, B, n, tan)
  const rows = buildSchedule(P, B, n, tan)

  it('installment is 701.16', () => {
    expect(M).toBe(E(701.16))
  })

  it('row 1: interest 218.46, principal 482.70, balance 34,517.30', () => {
    expect(rows[0].interest).toBe(E(218.46))
    expect(rows[0].principal).toBe(E(482.7))
    expect(rows[0].balance).toBe(E(34517.3))
  })

  it('row 2: interest 215.45, principal 485.71, balance 34,031.59', () => {
    expect(rows[1].interest).toBe(E(215.45))
    expect(rows[1].principal).toBe(E(485.71))
    expect(rows[1].balance).toBe(E(34031.59))
  })

  it('balance after month 12 is 29,004.53', () => {
    expect(rows[11].balance).toBe(E(29004.53))
  })

  it('last installment is 701.28 and final balance is 0', () => {
    expect(rows[n - 1].payment).toBe(E(701.28))
    expect(rows[n - 1].balance).toBe(0)
  })

  it('total interest is 7,069.72 and sum of installments is 42,069.72', () => {
    expect(rows.reduce((s, r) => s + r.interest, 0)).toBe(E(7069.72))
    expect(rows.reduce((s, r) => s + r.payment, 0)).toBe(E(42069.72))
  })
})

describe('T2. Small loan', () => {
  const P = E(10000)
  const n = 12
  const tan = 6
  const M = computeInstallment(P, 0, n, tan)
  const rows = buildSchedule(P, 0, n, tan)

  it('installment is 860.66', () => {
    expect(M).toBe(E(860.66))
  })

  it('row 1 interest is 50.00', () => {
    expect(rows[0].interest).toBe(E(50))
  })

  it('last installment is 860.70 and total interest is 327.96', () => {
    expect(rows[n - 1].payment).toBe(E(860.7))
    expect(rows.reduce((s, r) => s + r.interest, 0)).toBe(E(327.96))
  })
})

describe('T3. Zero interest', () => {
  it('(a) P=12,000 n=24 TAN 0: installment 500.00, total interest 0, final balance 0', () => {
    const M = computeInstallment(E(12000), 0, 24, 0)
    const rows = buildSchedule(E(12000), 0, 24, 0)
    expect(M).toBe(E(500))
    expect(rows.reduce((s, r) => s + r.interest, 0)).toBe(0)
    expect(rows[23].balance).toBe(0)
  })

  it('(b) P=10,000 n=36 TAN 0: installment 277.78, last 277.70, sum 10,000.00', () => {
    const M = computeInstallment(E(10000), 0, 36, 0)
    const rows = buildSchedule(E(10000), 0, 36, 0)
    expect(M).toBe(E(277.78))
    expect(rows[35].payment).toBe(E(277.7))
    expect(rows.reduce((s, r) => s + r.payment, 0)).toBe(E(10000))
  })

  it('(c) balloon P=20,000 B=8,000 n=48 TAN 0: installment 250.00, final balance 8,000.00, total interest 0', () => {
    const M = computeInstallment(E(20000), E(8000), 48, 0)
    const rows = buildSchedule(E(20000), E(8000), 48, 0)
    expect(M).toBe(E(250))
    expect(rows[47].balance).toBe(E(8000))
    expect(rows.reduce((s, r) => s + r.interest, 0)).toBe(0)
  })
})

describe('T4. Balloon loan', () => {
  const P = E(37000)
  const B = E(17477)
  const n = 60
  const tan = 7.49
  const M = computeInstallment(P, B, n, tan)
  const rows = buildSchedule(P, B, n, tan)

  it('installment is 500.19', () => {
    expect(M).toBe(E(500.19))
  })

  it('row 1: interest 230.94, principal 269.25, balance 36,730.75', () => {
    expect(rows[0].interest).toBe(E(230.94))
    expect(rows[0].principal).toBe(E(269.25))
    expect(rows[0].balance).toBe(E(36730.75))
  })

  it('balance after month 12 is 33,655.77', () => {
    expect(rows[11].balance).toBe(E(33655.77))
  })

  it('last installment is 500.50 and final balance is 17,477.00', () => {
    expect(rows[n - 1].payment).toBe(E(500.5))
    expect(rows[n - 1].balance).toBe(E(17477))
  })

  it('total interest is 10,488.71 and sum of installments is 30,011.71', () => {
    expect(rows.reduce((s, r) => s + r.interest, 0)).toBe(E(10488.71))
    expect(rows.reduce((s, r) => s + r.payment, 0)).toBe(E(30011.71))
  })
})

describe('T5. Leasing, calculated mode', () => {
  const P = E(35300)
  const B = E(14669)
  const n = 60
  const tan = 7.49
  const M = computeInstallment(P, B, n, tan)
  const rows = buildSchedule(P, B, n, tan)

  it('installment is 504.86', () => {
    expect(M).toBe(E(504.86))
  })

  it('row 1 interest is 220.33', () => {
    expect(rows[0].interest).toBe(E(220.33))
  })

  it('last installment is 505.11 and final balance is 14,669.00', () => {
    expect(rows[n - 1].payment).toBe(E(505.11))
    expect(rows[n - 1].balance).toBe(E(14669))
  })

  it('total interest is 9,660.85', () => {
    expect(rows.reduce((s, r) => s + r.interest, 0)).toBe(E(9660.85))
  })
})
