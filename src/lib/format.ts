const euros = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
  useGrouping: 'always',
})
const percent = new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Whole euros, Italian style: 46.990 €. */
export function formatMoneyRounded(cents: number): string {
  return euros.format(cents / 100)
}

/** Two decimals, Italian style: 7,49%. */
export function formatPercent(value: number): string {
  return `${percent.format(value)}%`
}
