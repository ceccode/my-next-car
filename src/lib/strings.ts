/**
 * Every piece of copy the interface shows, in Italian, grouped by where it appears.
 * Functions receive values that are already formatted.
 */
import type { FinancedResult, MethodKind } from '@/domain/financing/types'

export const APP = {
  name: 'My Next Car',
  description: 'Confronta contanti, finanziamento, maxirata e leasing per la stessa auto.',
  heading: 'My Next Car: quanto costa davvero la tua prossima auto',
  menu: 'Menu',
  close: 'Chiudi',
} as const

export const METHOD = {
  cash: { name: 'Contanti', tagline: 'Paghi tutto subito', short: 'Tutto subito' },
  loan: { name: 'Finanziamento', tagline: "Rate fisse, l'auto è subito tua", short: '' },
  balloon: { name: 'Maxirata', tagline: 'Rate basse, poi una rata finale grande', short: '' },
  leasing: { name: 'Leasing', tagline: "Canone mensile, poi riscatti l'auto", short: '' },
} as const satisfies Record<MethodKind, { name: string; tagline: string; short: string }>

/** "conviene il finanziamento", "conviene la maxirata". */
const WITH_ARTICLE: Record<MethodKind, string> = {
  cash: 'i contanti',
  loan: 'il finanziamento',
  balloon: 'la maxirata',
  leasing: 'il leasing',
}

/** "più del finanziamento", "più della maxirata". */
const AFTER_THAN: Record<MethodKind, string> = {
  cash: 'dei contanti',
  loan: 'del finanziamento',
  balloon: 'della maxirata',
  leasing: 'del leasing',
}

export const PRICE = {
  label: "Prezzo dell'auto",
  vat: 'IVA inclusa',
  example: 'Esempio',
  netPrice: 'Con sconti e spese:',
  adjustments: 'Sconti, permuta e spese',
  adjustmentsEmpty: 'Facoltativo',
  adjustmentsCount: (n: number) => (n === 1 ? '1 voce inserita' : `${n} voci inserite`),
} as const

export const TERMS = {
  region: 'Come paghi',
  downPayment: 'Anticipo',
  duration: 'Durata',
  rate: 'Tasso (TAN)',
  months: (n: number) => `${n} mesi`,
  monthsSpoken: (n: number) => (n % 12 === 0 ? `${n} mesi, ${n / 12} ${n === 12 ? 'anno' : 'anni'}` : `${n} mesi`),
} as const

export const TOTALS = {
  title: 'Quanto spendi in tutto',
  legendPrice: "Prezzo dell'auto",
  legendExtra: 'Interessi e spese',
  cheapest: 'Spendi meno',
  cheapestFinanced: 'Meglio a rate',
  perMonth: '/mese',
  unavailable: 'Da verificare',
  inTotal: 'in tutto',
  perMonthSpoken: 'al mese',
  details: 'Dettagli',
  financingPremium: (method: MethodKind, premium: string) =>
    `A rate conviene ${WITH_ARTICLE[method]}: ${premium} in più dei contanti.`,
  lowestMonthlyCostsMore: (method: MethodKind, monthly: string, overpay: string, versus: MethodKind) =>
    `${METHOD[method].name} ha la rata più bassa (${monthly}) ma costa ${overpay} più ${AFTER_THAN[versus]}.`,
} as const

export const QUOTE = {
  title: 'Hai un preventivo?',
  action: 'Inserisci i numeri',
  pickTitle: 'Che formula ti hanno proposto?',
  pickDescription: 'Inserisci i numeri e li confrontiamo con le altre formule.',
} as const

export const DETAIL = {
  perMonth: 'Ogni mese',
  atSigning: 'Alla firma',
  finalPayment: (kind: FinancedResult['kind']) => (kind === 'leasing' ? 'Riscatto alla fine' : 'Maxirata alla fine'),
  extraCost: 'Interessi e spese',
  total: 'In tutto',
  payNow: 'Paghi subito',
  cashNote: 'Nessun interesse e nessuna spesa di finanziamento: è il riferimento con cui confrontare le altre formule.',
  rates: (tan: string, rateIsImplied: boolean, taeg: string | null) =>
    `TAN ${tan}${rateIsImplied ? ' (ricavato dal canone)' : ''}${taeg ? ` · TAEG stimato ${taeg}` : ''}.`,
  taegEstimate: 'Il TAEG mostrato è una stima basata sui tuoi dati, non quello ufficiale del contratto.',
  fromQuote: 'Dal tuo preventivo',
  quotedTaeg: 'TAEG del preventivo',
  quotedTaegHint: 'Lo confrontiamo con quello stimato.',
  balloonPayment: 'Maxirata finale',
  balloonPaymentHint: "La rata finale che paghi per tenere l'auto.",
  balloonEnd:
    "Alla fine puoi pagare la maxirata e tenere l'auto (è il caso calcolato qui), rifinanziarla con nuovi interessi, oppure vendere l'auto per saldarla.",
  quotedMonthly: 'Ho già il canone mensile',
  quotedMonthlyHint: 'Calcoliamo noi il tasso implicito.',
  quotedMonthlyPayment: 'Canone mensile del preventivo',
  buyout: 'Riscatto finale',
  buyoutHint: 'Quanto paghi alla fine per diventare proprietario.',
  leasingOwnership: "Durante il leasing l'auto è della società di leasing: diventa tua solo dopo il riscatto.",
  returnOption: "Posso restituire l'auto alla fine",
  returnFees: 'Costi stimati di restituzione',
  returned: (total: string) =>
    `Se restituisci l'auto alla fine paghi ${total} in tutto, e l'auto non diventa tua.`,
  taegComparison: {
    aligned: (quoted: string, estimated: string) =>
      `Il TAEG del preventivo (${quoted}) è in linea con quello stimato (${estimated}).`,
    higher: (quoted: string, estimated: string) =>
      `Il TAEG del preventivo (${quoted}) è più alto di quello stimato (${estimated}). Probabilmente include costi che non hai inserito, come assicurazioni o servizi: chiedi il dettaglio delle spese.`,
    lower: (quoted: string, estimated: string) =>
      `Il TAEG del preventivo (${quoted}) è più basso di quello stimato (${estimated}). Controlla le spese e il TAN che hai inserito.`,
  },
} as const

export const ADJUSTMENTS = {
  title: 'Sconti, permuta e spese',
  finalPrice: 'Prezzo finale',
  incentives: 'Sconti e incentivi',
  incentivesHint: 'Quello che il venditore o lo Stato ti tolgono dal prezzo.',
  discount: 'Sconto del venditore',
  scrappageIncentive: 'Incentivo rottamazione',
  otherIncentives: 'Altri incentivi',
  additionalCosts: 'Messa su strada e immatricolazione',
  tradeIn: 'La tua auto attuale',
  tradeInHint: 'Se la dai in permuta.',
  tradeInValue: 'Quanto te la valutano',
  tradeInDebt: 'Debito ancora da pagare',
  tradeInCovers: (equity: string) =>
    `La permuta copre ${equity} dell'acquisto. Riduce il denaro da versare, ma non è uno sconto: paghi con il valore della tua auto attuale.`,
  tradeInShortfall: (shortfall: string) =>
    `La tua auto vale ${shortfall} meno del debito ancora aperto. Questa somma va comunque pagata: si aggiunge al denaro da versare o all'importo finanziato.`,
  fees: 'Spese del finanziamento',
  feesHint: 'Valgono per finanziamento, maxirata e leasing.',
  upfrontFees: 'Spese di apertura pratica',
  monthlyFee: 'Spese mensili (incasso rata)',
} as const

export const MENU = {
  share: 'Condividi la simulazione',
  linkCopied: 'Link copiato',
  shareLink: 'Link della simulazione',
  exportCsv: 'Scarica i numeri (CSV)',
  csvFileName: 'my-next-car-confronto.csv',
  reset: 'Ricomincia da capo',
  resetConfirm: "Vuoi cancellare i tuoi valori e ripartire dall'esempio?",
  privacy: 'Tutti gli importi sono in euro, IVA inclusa. I dati restano sul tuo dispositivo.',
} as const

export const NOTES = {
  example: "Valori di esempio, ipotetici: non sono un'offerta.",
  excludedCosts:
    'Il confronto considera solo prezzo e finanziamento. Restano fuori carburante o ricarica, assicurazione, manutenzione, bollo e svalutazione.',
} as const

/** Labels used in the CSV export. */
export const VEHICLE_TYPES = {
  electric: 'Elettrica',
  hybrid: 'Ibrida',
  combustion: 'Termica',
  other: 'Altro',
} as const

export const VEHICLE_CONDITIONS = {
  new: 'Nuovo',
  used: 'Usato',
} as const
