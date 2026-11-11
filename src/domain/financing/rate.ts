import type { Cents } from './types'

export function solveMonthlyRate(amount: Cents, payments: Cents[]): number | null {
  const pv = (i: number) => payments.reduce((s, p, idx) => s + p / Math.pow(1 + i, idx + 1), 0)
  const total = payments.reduce((s, p) => s + p, 0)
  if (amount <= 0 || total < amount) return null
  if (total === amount) return 0
  let lo = 0
  let hi = 1
  if (pv(hi) > amount) return null
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2
    if (pv(mid) > amount) lo = mid; else hi = mid
  }
  return (lo + hi) / 2
}
