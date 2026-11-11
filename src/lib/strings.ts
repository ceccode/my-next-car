export const APP = {
  name: 'My Next Car',
  descriptor: 'Simulatore finanziamento veicolo',
  subtitle: 'Capisci quanto ti costa davvero il tuo prossimo veicolo, prima di firmare.',
  pageTitle: 'My Next Car | Simulatore finanziamento veicolo',
} as const

export const HEADER = {
  copyLink: 'Copia link',
  linkCopied: 'Link copiato',
  exportCsv: 'Esporta CSV',
  resetExample: 'Ripristina esempio',
  resetConfirm: "Vuoi sostituire i valori attuali con lo scenario di esempio?",
} as const

export const STEPS = {
  vehicle: '1. Il veicolo',
  tradeIn: '2. La tua permuta (facoltativo)',
  offers: '3. Le offerte di finanziamento',
} as const

export const VEHICLE_FIELDS = {
  name: 'Nome del veicolo (facoltativo)',
  type: 'Alimentazione (facoltativo)',
  condition: 'Condizione',
  listPrice: 'Prezzo di listino (IVA inclusa)',
  discount: 'Sconti del venditore',
  scrappageIncentive: 'Incentivo rottamazione',
  otherIncentives: 'Altri incentivi o contributi',
  additionalCosts: 'Costi aggiuntivi (messa su strada, immatricolazione, IPT)',
  netPrice: 'Prezzo netto:',
} as const

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

export const TRADE_IN = {
  value: 'Valore del veicolo che dai in permuta',
  outstandingLoan: 'Debito residuo sul veicolo attuale',
  netValue: 'Valore netto della permuta:',
  positiveNote: (equity: string) =>
    `La permuta copre ${equity} dell'acquisto. Riduce il denaro che devi versare, ma non è uno sconto: stai pagando con il valore del tuo veicolo attuale.`,
  negativeNote: (absEquity: string) =>
    `Il tuo veicolo attuale vale ${absEquity} meno del debito ancora aperto. Questa somma va comunque pagata: si aggiunge al denaro da versare o all'importo finanziato.`,
} as const

export const SHARED = {
  title: 'Valori comuni',
  downPayment: 'Anticipo',
  months: 'Durata (mesi)',
  tanPercent: 'TAN (%)',
  upfrontFees: 'Spese iniziali',
  monthlyFee: 'Spese mensili',
  applyToAll: 'Applica a tutti i finanziamenti',
} as const

export const FINANCING_FIELDS = {
  quotedTaegPercent: 'TAEG indicato nel preventivo (%) (facoltativo)',
  balloonPayment: 'Maxirata finale',
  returnOption: 'Il contratto prevede la restituzione del veicolo',
  returnFees: 'Costi stimati di restituzione',
  leasingMode: 'Come vuoi inserire i dati?',
  leasingModeCalculated: 'Calcola il canone dal TAN',
  leasingModeQuoted: 'Ho già un preventivo',
  initialPayment: 'Anticipo (maxicanone)',
  quotedMonthlyPayment: 'Canone mensile del preventivo',
  buyout: 'Riscatto finale',
  tanImplicit: 'TAN implicito (stimato)',
} as const

export const EXAMPLE_NOTE = "I valori di esempio sono ipotetici e non rappresentano un'offerta."

export const METHODS = {
  cash: 'Contanti',
  loan: 'Finanziamento classico',
  balloon: 'Finanziamento con maxirata',
  leasing: 'Leasing finanziario',
} as const

export const METHODS_WITH_ARTICLE = {
  cash: 'il pagamento in contanti',
  loan: 'il finanziamento classico',
  balloon: 'il finanziamento con maxirata',
  leasing: 'il leasing',
} as const

export const VERDICT = {
  title: 'Cosa conviene',
  headline: (methodName: string, totalCost: string) =>
    `Il costo totale più basso è ${methodName}: ${totalCost}.`,
  depends: 'Dipende da cosa conta di più per te:',
  tiles: {
    totalCost: 'Spendi meno in totale',
    totalCostCaption: 'costo totale',
    cheapestFinanced: 'Il finanziamento meno caro',
    cheapestFinancedCaption: 'in più rispetto ai contanti',
    lowestMonthly: 'La rata più bassa',
    lowestMonthlyCaption: 'al mese',
    lowestMonthlyExtra: (difference: string) =>
      `ma costa ${difference} in più del finanziamento meno caro`,
    lowestInitial: 'Meno soldi da versare subito',
    lowestInitialCaption: 'alla firma',
  },
} as const

export const TAN_TAEG_ALERT =
  'Il TAN è il tasso di interesse "puro": serve a calcolare gli interessi, ma non comprende le spese. Il TAEG è il costo complessivo del finanziamento in percentuale annua: comprende interessi e spese obbligatorie. Per confrontare due offerte guarda il TAEG, non il TAN: un\'offerta a TAN 0% può avere comunque un TAEG maggiore di zero.'

export const TAN_TAEG_ALERT_TITLE = 'TAN e TAEG in breve.'

export const CARDS = {
  totalCost: 'Costo totale se tieni il veicolo',
  monthlyOutflow: 'Rata mensile',
  initialCash: 'Da versare subito',
  receive: 'Ricevi',
  months: 'Durata',
  monthsSuffix: 'mesi',
  finalPayment: 'Pagamento finale',
  finalPaymentBalloon: 'Maxirata',
  finalPaymentLeasing: 'Riscatto',
  noFinalPayment: 'nessuno',
  noMonthlyOutflow: 'nessuna',
  totalInterest: 'Interessi totali',
  fees: 'Spese',
  tan: 'TAN',
  estimatedTaeg: 'TAEG stimato',
  extraVsCash: 'In più rispetto ai contanti',
  sameAsCash: 'stesso costo dei contanti',
  reference: 'riferimento',
  nd: 'n.d.',
  badgeLowestCost: 'Costo totale più basso',
  badgeCheapestFinanced: 'Finanziamento meno caro',
  badgeLowestMonthly: 'Rata più bassa',
  returned: (total: string) =>
    `Se restituisci il veicolo alla fine: paghi ${total} in totale e non resti proprietario del veicolo.`,
  balloonAccordionTitle: 'Cosa succede alla fine del contratto?',
  balloonEndOptions: [
    'Paghi la maxirata e tieni il veicolo. È l\'ipotesi usata nel confronto.',
    'Rifinanzi la maxirata con un nuovo prestito. Questo aggiunge nuovi interessi, non compresi nei numeri qui sopra.',
    "Vendi il veicolo e usi il ricavato per pagare la maxirata. Il risultato dipende dal valore di mercato in quel momento, che questo simulatore non stima.",
    'Restituisci il veicolo, solo se il tuo contratto lo prevede.',
  ],
  leasingNote:
    "Durante il leasing il veicolo è di proprietà della società di leasing. Diventi proprietario solo dopo aver pagato il riscatto.",
} as const

export const SAVED = {
  save: 'Salva come scenario di confronto',
  comparing: 'Stai confrontando con lo scenario salvato.',
  update: 'Aggiorna scenario salvato',
  remove: 'Rimuovi confronto',
  less: (value: string) => `▼ ${value} in meno rispetto allo scenario salvato`,
  more: (value: string) => `▲ ${value} in più rispetto allo scenario salvato`,
} as const

export const TAEG_COMPARISON = {
  aligned: (quoted: string, estimated: string) =>
    `Il TAEG del preventivo (${quoted}) è in linea con quello stimato (${estimated}).`,
  higher: (quoted: string, estimated: string) =>
    `Il TAEG del preventivo (${quoted}) è più alto di quello stimato (${estimated}). Il preventivo include probabilmente costi che non hai inserito, ad esempio assicurazioni o servizi accessori: chiedi il dettaglio delle spese.`,
  lower: (quoted: string, estimated: string) =>
    `Il TAEG del preventivo (${quoted}) è più basso di quello stimato (${estimated}). Controlla le spese e il TAN che hai inserito.`,
} as const

export const TABLE = {
  title: 'Confronto dettagliato',
  rows: {
    initialCash: 'Da versare subito',
    monthlyOutflow: 'Rata mensile',
    months: 'Numero di rate',
    finalPayment: 'Pagamento finale',
    totalInterest: 'Interessi totali',
    fees: 'Spese',
    tan: 'TAN',
    estimatedTaeg: 'TAEG stimato',
    totalCashPaid: 'Esborso totale',
    totalCost: 'Costo totale',
    ownerDuring: 'Proprietario durante il contratto',
    ownerEnd: 'Proprietario alla fine',
    returnOption: 'Possibilità di restituzione',
  },
  you: 'Tu',
  leasingCompany: 'Società di leasing',
  youAfterBalloon: 'Tu, dopo la maxirata',
  youAfterBuyout: 'Tu, dopo il riscatto',
  notProvided: 'Non prevista',
  returnYes: 'Sì, da contratto',
  returnNo: 'No',
  dash: '—',
} as const

export const CHARTS = {
  heading: 'Grafici',
  showTable: 'Mostra i dati in tabella',
  amortizationTitle: 'Piano di ammortamento',
  tabs: {
    totalCost: 'Costo totale',
    whenYouPay: 'Quando paghi',
    debt: 'Debito residuo',
    interestPrincipal: 'Interessi e capitale',
    outflows: 'Uscite nel tempo',
    whatIf: 'E se cambiasse...?',
  },
  chart1: {
    title: 'Quanto costa davvero ogni soluzione?',
    caption:
      'La parte blu è uguale per tutti. Tutto ciò che sta sopra è il costo del finanziamento.',
    netPrice: 'Prezzo netto',
    interest: 'Interessi',
    fees: 'Spese',
  },
  chart2: {
    title: 'Quando devo pagare?',
    caption: 'Una rata bassa può nascondere un pagamento finale elevato.',
    tradeInNote:
      'Il valore della permuta non compare qui perché non è un pagamento in denaro.',
    signing: 'Alla firma',
    monthly: 'Rate mensili',
    finalPayment: 'Pagamento finale',
  },
  chart3: {
    title: 'Quanto debito mi resta, mese dopo mese?',
    caption:
      "Con la maxirata o il leasing il debito scende lentamente: quello che resta alla fine è il pagamento finale.",
    quotedNote: 'La linea del leasing usa il tasso implicito stimato dal preventivo.',
  },
  chart4: {
    title: 'Quanta parte della rata sono interessi?',
    principal: 'Capitale',
    interest: 'Interessi',
    finalPaymentCaption: (months: number, finalPayment: string) =>
      `Alla rata ${months} si aggiunge un pagamento finale di ${finalPayment}.`,
    month: 'Mese',
    payment: 'Rata',
    principalCol: 'Capitale',
    interestCol: 'Interessi',
    balanceCol: 'Debito residuo',
  },
  chart5: {
    title: 'Quanti soldi escono dal mio conto nel tempo?',
    caption:
      "Mostra il denaro che esce dal conto nel tempo. Il punto finale di ogni linea è l'esborso totale.",
  },
  chart6: {
    method: 'Metodo',
    parameter: 'Parametro',
    metric: 'Misura',
    params: {
      tan: 'TAN',
      months: 'Durata',
      downPayment: 'Anticipo',
      finalPayment: 'Pagamento finale',
    },
    metrics: {
      monthlyOutflow: 'Rata mensile',
      totalInterest: 'Interessi totali',
      totalEconomicCost: 'Costo totale',
    },
    today: 'Oggi',
    sentence: (first: string, last: string, metric: string, metricFirst: string, metricLast: string) =>
      `Passando da ${first} a ${last}, ${metric} passa da ${metricFirst} a ${metricLast}.`,
    quotedModeNote:
      'La simulazione è disponibile per il leasing solo nella modalità «Calcola il canone dal TAN».',
    tableColumns: {
      value: 'valore',
      monthlyOutflow: 'rata mensile',
      totalInterest: 'interessi totali',
      totalEconomicCost: 'costo totale',
    },
    monthsUnit: 'mesi',
    noData: 'Nessun valore valido da mostrare.',
  },
  monthsAxis: 'Mese',
} as const

export const EXPLANATIONS = {
  title: 'Una rata più bassa non significa un veicolo meno caro.',
} as const

export const EXCLUDED_COSTS_NOTE =
  "Questo simulatore confronta solo i costi di acquisto e di finanziamento. Carburante o ricarica, assicurazione, manutenzione, bollo auto, parcheggi, pedaggi, svalutazione e valore di rivendita non sono inclusi. I risultati sono stime a scopo informativo: non costituiscono un'offerta né una consulenza finanziaria. Gli importi si intendono IVA inclusa."

export const GLOSSARY_TITLE = 'Glossario'

export interface GlossaryEntry {
  term: string
  definition: string
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: 'TAN (Tasso Annuo Nominale)',
    definition:
      'È il tasso di interesse annuo applicato al capitale che ti viene prestato. Serve a calcolare gli interessi di ogni rata. Non comprende spese, commissioni e imposte.',
  },
  {
    term: 'TAEG (Tasso Annuo Effettivo Globale)',
    definition:
      'È il costo complessivo del finanziamento, espresso in percentuale annua. Oltre agli interessi comprende le spese obbligatorie, come istruttoria, incasso rata, imposte e assicurazioni obbligatorie. È il numero da usare per confrontare offerte diverse: a parità di importo e durata, il TAEG più basso costa meno.',
  },
  {
    term: 'TAEG stimato',
    definition:
      'È il TAEG calcolato da questo simulatore con i dati che hai inserito. È una stima a scopo informativo: il TAEG ufficiale è solo quello scritto nel contratto o nel modulo informativo precontrattuale (SECCI). Nei contratti di leasing l\'indicatore equivalente è spesso chiamato "tasso leasing".',
  },
  {
    term: 'Prezzo netto',
    definition: 'Il prezzo del veicolo dopo sconti e incentivi, più i costi aggiuntivi di acquisto.',
  },
  {
    term: 'Permuta',
    definition:
      'Il veicolo che possiedi oggi e che cedi al venditore. Il suo valore riduce il denaro che devi versare, ma non è uno sconto: stai pagando con il valore del tuo veicolo.',
  },
  {
    term: 'Valore netto della permuta',
    definition:
      'Il valore del tuo veicolo attuale meno il debito ancora aperto su di esso. Può essere negativo.',
  },
  {
    term: 'Anticipo',
    definition:
      'Il denaro che versi alla firma, in aggiunta all\'eventuale valore netto della permuta. Nel leasing si chiama anche maxicanone.',
  },
  {
    term: 'Importo finanziato',
    definition:
      "La parte del prezzo netto che non copri con anticipo e permuta, e che quindi ti viene prestata. Gli interessi si calcolano su questo importo.",
  },
  {
    term: 'Rata',
    definition:
      'Il pagamento mensile. Ogni rata contiene una quota di capitale (restituisci il prestito) e una quota di interessi (il costo del prestito). Nel leasing si chiama canone.',
  },
  {
    term: 'Maxirata',
    definition:
      'Un unico pagamento elevato alla fine del finanziamento, insieme all\'ultima rata. Rende le rate mensili più basse, ma lascia una parte importante del debito da pagare alla fine. È chiamata anche rata finale o valore futuro garantito.',
  },
  {
    term: 'Riscatto',
    definition: 'L\'importo che paghi alla fine del leasing per diventare proprietario del veicolo.',
  },
  {
    term: 'Leasing finanziario',
    definition:
      'Un contratto in cui la società di leasing acquista il veicolo e te lo concede in uso in cambio di canoni mensili. Diventi proprietario solo se paghi il riscatto finale. È diverso dal noleggio a lungo termine, che questo simulatore non considera.',
  },
  {
    term: 'Spese iniziali',
    definition:
      'Spese e imposte pagate una sola volta alla firma, ad esempio spese di istruttoria e imposta di bollo o imposta sostitutiva.',
  },
  {
    term: 'Spese mensili',
    definition: 'Un importo fisso aggiunto a ogni rata, ad esempio le spese di incasso rata.',
  },
  {
    term: 'Interessi totali',
    definition: 'La somma di tutti gli interessi pagati durante il contratto.',
  },
  {
    term: 'Costo totale',
    definition:
      'Prezzo netto più interessi totali più tutte le spese del finanziamento, nell\'ipotesi che tu tenga il veicolo alla fine.',
  },
  {
    term: 'Esborso totale',
    definition: 'Tutto il denaro che esce dal tuo conto: il costo totale meno il valore netto della permuta.',
  },
  {
    term: 'Piano di ammortamento',
    definition:
      'La tabella che mostra, mese per mese, quanta parte della rata è capitale, quanta è interessi e quanto debito resta.',
  },
]

export const INFO_ARIA = (term: string) => `Spiegazione: ${term}`

export const SHORT_TERMS: Record<string, string> = {
  tan: 'TAN (Tasso Annuo Nominale)',
  taeg: 'TAEG (Tasso Annuo Effettivo Globale)',
  estimatedTaeg: 'TAEG stimato',
  netPrice: 'Prezzo netto',
  tradeIn: 'Permuta',
  tradeInEquity: 'Valore netto della permuta',
  downPayment: 'Anticipo',
  principal: 'Importo finanziato',
  installment: 'Rata',
  balloon: 'Maxirata',
  buyout: 'Riscatto',
  leasing: 'Leasing finanziario',
  upfrontFees: 'Spese iniziali',
  monthlyFee: 'Spese mensili',
  totalInterest: 'Interessi totali',
  totalCost: 'Costo totale',
  totalCashPaid: 'Esborso totale',
  amortization: 'Piano di ammortamento',
}
