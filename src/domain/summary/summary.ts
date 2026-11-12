import type { Cents, ComparisonResult, FinancedKind, FinancedResult, MethodKind } from '@/domain/financing/types'

const METHOD_KINDS: MethodKind[] = ['cash', 'loan', 'balloon', 'leasing']
const FINANCED_KINDS: FinancedKind[] = ['loan', 'balloon', 'leasing']

export type RankedOption =
  | { kind: MethodKind; available: true; total: Cents; extraCost: Cents; monthly: Cents | null }
  | { kind: MethodKind; available: false }

/** Every way of paying, cheapest total cost first; options that cannot be computed come last. */
export function rankByTotalCost(result: ComparisonResult): RankedOption[] {
  const options: RankedOption[] = METHOD_KINDS.map((kind) => {
    const method = result[kind]
    if (!method.valid) return { kind, available: false }
    return {
      kind,
      available: true,
      total: method.totalEconomicCost,
      extraCost: method.extraCostVsCash,
      monthly: method.kind === 'cash' ? null : method.monthlyOutflow,
    }
  })
  const rank = (option: RankedOption) => (option.available ? option.total : Infinity)
  return options.sort((a, b) => rank(a) - rank(b))
}

export type Insight =
  | { kind: 'lowestMonthlyCostsMore'; method: FinancedKind; monthly: Cents; overpay: Cents; versus: FinancedKind }
  | { kind: 'financingPremium'; method: FinancedKind; premium: Cents }

/**
 * The one thing worth saying about the comparison. A low monthly payment that hides a
 * higher total is the classic trap, so it wins; otherwise we say what financing costs.
 */
export function keyInsight(result: ComparisonResult): Insight | null {
  const financed = FINANCED_KINDS.map((kind) => result[kind]).filter((m): m is FinancedResult => m.valid)
  if (financed.length === 0) return null

  const cheapest = minBy(financed, (m) => m.totalEconomicCost)
  const lowestMonthly = minBy(financed, (m) => m.monthlyOutflow)
  const overpay = lowestMonthly.totalEconomicCost - cheapest.totalEconomicCost

  if (overpay > 0) {
    return {
      kind: 'lowestMonthlyCostsMore',
      method: lowestMonthly.kind,
      monthly: lowestMonthly.monthlyOutflow,
      overpay,
      versus: cheapest.kind,
    }
  }
  return { kind: 'financingPremium', method: cheapest.kind, premium: cheapest.extraCostVsCash }
}

const SCALE_STEP: Cents = 1_000_000 // 10.000 €
const SCALE_HEADROOM = 1.5

/**
 * The full width of the cost bars. Anchored to the price rather than to the largest
 * total, so a bar only changes length when its own total changes.
 */
export function barScale(netPurchasePrice: Cents, totals: Cents[]): Cents {
  const needed = Math.max(netPurchasePrice * SCALE_HEADROOM, ...totals, 1)
  return Math.ceil(needed / SCALE_STEP) * SCALE_STEP
}

function minBy<T>(items: T[], value: (item: T) => number): T {
  return items.reduce((best, item) => (value(item) < value(best) ? item : best))
}
