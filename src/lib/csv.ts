import type { ComparisonResult, SimulationState } from '@/domain/financing/types'
import { VEHICLE_TYPES, VEHICLE_CONDITIONS } from './strings'

const num = (cents: number): string => (cents / 100).toFixed(2).replace('.', ',')
const euros = (value: number): string => value.toFixed(2).replace('.', ',')
const int = (value: number): string => String(value)
const text = (value: string): string => `"${value.replace(/"/g, '""')}"`
const yesNo = (value: boolean): string => (value ? 'Sì' : 'No')

export function buildCsv(state: SimulationState, result: ComparisonResult): string {
  const lines: string[] = []

  lines.push(text('Dati inseriti'))
  lines.push(['Sezione', 'Campo', 'Valore'].map(text).join(';'))

  const inputRow = (sezione: string, campo: string, valore: string) => {
    lines.push([text(sezione), text(campo), text(valore)].join(';'))
  }

  inputRow('Veicolo', 'Nome del veicolo (facoltativo)', state.vehicle.name)
  inputRow('Veicolo', 'Alimentazione (facoltativo)', VEHICLE_TYPES[state.vehicle.type])
  inputRow('Veicolo', 'Condizione', VEHICLE_CONDITIONS[state.vehicle.condition])
  inputRow('Veicolo', 'Prezzo di listino (IVA inclusa)', euros(state.acquisition.listPrice))
  inputRow('Veicolo', 'Sconti del venditore', euros(state.acquisition.discount))
  inputRow('Veicolo', 'Incentivo rottamazione', euros(state.acquisition.scrappageIncentive))
  inputRow('Veicolo', 'Altri incentivi o contributi', euros(state.acquisition.otherIncentives))
  inputRow('Veicolo', 'Costi aggiuntivi (messa su strada, immatricolazione, IPT)', euros(state.acquisition.additionalCosts))
  inputRow('Permuta', 'Valore del veicolo che dai in permuta', euros(state.acquisition.tradeInValue))
  inputRow('Permuta', 'Debito residuo sul veicolo attuale', euros(state.acquisition.tradeInOutstandingLoan))

  const methodRows = (
    sezione: string,
    m: {
      downPayment?: number
      initialPayment?: number
      months: number
      tanPercent: number
      upfrontFees: number
      monthlyFee: number
      quotedTaegPercent?: number
    },
    extra?: (section: string) => void,
  ) => {
    const anticipo = m.initialPayment ?? m.downPayment ?? 0
    inputRow(sezione, 'Anticipo', euros(anticipo))
    inputRow(sezione, 'Durata (mesi)', int(m.months))
    inputRow(sezione, 'TAN (%)', euros(m.tanPercent))
    inputRow(sezione, 'Spese iniziali', euros(m.upfrontFees))
    inputRow(sezione, 'Spese mensili', euros(m.monthlyFee))
    inputRow(sezione, 'TAEG indicato nel preventivo (%) (facoltativo)', euros(m.quotedTaegPercent ?? 0))
    extra?.(sezione)
  }

  methodRows('Valori comuni', state.shared)
  methodRows('Finanziamento classico', state.loan)
  methodRows('Finanziamento con maxirata', state.balloon, (s) => {
    inputRow(s, 'Maxirata finale', euros(state.balloon.balloonPayment))
    inputRow(s, 'Il contratto prevede la restituzione del veicolo', yesNo(state.balloon.returnOptionEnabled))
    inputRow(s, 'Costi stimati di restituzione', euros(state.balloon.returnFees))
  })
  inputRow('Leasing finanziario', 'Come vuoi inserire i dati?', state.leasing.mode === 'calculated' ? 'Calcola il canone dal TAN' : 'Ho già un preventivo')
  methodRows('Leasing finanziario', state.leasing)
  inputRow('Leasing finanziario', 'Canone mensile del preventivo', euros(state.leasing.quotedMonthlyPayment))
  inputRow('Leasing finanziario', 'Riscatto finale', euros(state.leasing.buyout))
  inputRow('Leasing finanziario', 'Il contratto prevede la restituzione del veicolo', yesNo(state.leasing.returnOptionEnabled))
  inputRow('Leasing finanziario', 'Costi stimati di restituzione', euros(state.leasing.returnFees))

  lines.push('')

  lines.push(text('Risultati'))
  const headers = ['Voce', 'Contanti', 'Finanziamento classico', 'Finanziamento con maxirata', 'Leasing finanziario']
  lines.push(headers.map(text).join(';'))

  type Format = 'money' | 'percent' | 'int'

  const cell = (m: ComparisonResult['cash'] | ComparisonResult['loan'], key: string, format: Format): string | null => {
    if (!m.valid) return null
    const v = (m as unknown as Record<string, unknown>)[key]
    if (typeof v !== 'number') return null
    if (format === 'money') return num(v)
    if (format === 'percent') return euros(v)
    return int(v)
  }

  const resRow = (label: string, key: string, format: Format, includeCash: boolean): void => {
    const values = [
      includeCash ? cell(result.cash, key, format) : null,
      cell(result.loan, key, format),
      cell(result.balloon, key, format),
      cell(result.leasing, key, format),
    ]
    lines.push([text(label), ...values.map((v) => (v === null ? '' : v))].join(';'))
  }

  resRow('Da versare subito', 'initialCash', 'money', true)
  resRow('Rata mensile', 'monthlyOutflow', 'money', false)
  resRow('Numero di rate', 'months', 'int', false)
  resRow('Pagamento finale', 'finalPayment', 'money', false)
  resRow('Interessi totali', 'totalInterest', 'money', true)
  resRow('Spese', 'totalFees', 'money', true)
  resRow('Esborso totale', 'totalCashPaid', 'money', true)
  resRow('Costo totale', 'totalEconomicCost', 'money', true)
  resRow('In più rispetto ai contanti', 'extraCostVsCash', 'money', false)
  resRow('TAN (%)', 'nominalRatePercent', 'percent', false)
  resRow('TAEG stimato (%)', 'estimatedTaegPercent', 'percent', false)

  return '\uFEFF' + lines.join('\r\n') + '\r\n'
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
