const wholeFormat = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0, useGrouping: 'always' })
const decimalFormat = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 2, useGrouping: 'always' })

/** Reads an amount typed the Italian way: dots group thousands, the comma marks decimals. */
export function parseAmount(text: string): number {
  const normalized = text.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')
  const amount = Number.parseFloat(normalized)
  return Number.isFinite(amount) ? amount : 0
}

export function formatAmount(amount: number, { decimals = false } = {}): string {
  return (decimals ? decimalFormat : wholeFormat).format(amount)
}

/** What the field shows while the user is typing: no grouping, comma decimals. */
export function editableAmount(amount: number): string {
  return amount === 0 ? '' : String(amount).replace('.', ',')
}
