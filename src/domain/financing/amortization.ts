import type { Cents } from './types'

export function computeInstallment(P: Cents, B: Cents, n: number, tanPercent: number): Cents {
  const r = tanPercent / 100 / 12
  if (r === 0) return Math.round((P - B) / n)
  const v = Math.pow(1 + r, -n)
  return Math.round(((P - B * v) * r) / (1 - v))
}

export interface ScheduleRow {
  month: number      // 1..n
  payment: Cents     // installment, without the monthly fee and without the final payment
  interest: Cents
  principal: Cents
  balance: Cents     // remaining principal after this installment; at month n it equals B
}

export function buildSchedule(P: Cents, B: Cents, n: number, tanPercent: number): ScheduleRow[] {
  const r = tanPercent / 100 / 12
  const M = computeInstallment(P, B, n, tanPercent)
  const rows: ScheduleRow[] = []
  let balance = P
  for (let month = 1; month <= n; month++) {
    const interest = Math.round(balance * r)
    let principal = M - interest
    let payment = M
    if (month === n) {
      principal = balance - B
      payment = principal + interest
    }
    balance -= principal
    rows.push({ month, payment, interest, principal, balance })
  }
  return rows
}
