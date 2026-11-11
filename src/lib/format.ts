const moneyFmt = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const moneyRoundedFmt = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})
const percentFmt = new Intl.NumberFormat('it-IT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMoney(cents: number): string {
  return moneyFmt.format(cents / 100)
}

export function formatMoneyRounded(cents: number): string {
  return moneyRoundedFmt.format(cents / 100)
}

export function formatPercent(value: number): string {
  return `${percentFmt.format(value)}%`
}
