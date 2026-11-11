import { formatMoney } from '@/lib/format'
import type { ComparisonResult, FinancedKind } from './types'

const METHOD_WITH_ARTICLE: Record<FinancedKind, string> = {
  loan: 'Il finanziamento classico',
  balloon: 'Il finanziamento con maxirata',
  leasing: 'Il leasing',
}

export function buildExplanations(result: ComparisonResult): string[] {
  const out: string[] = []
  const loan = result.loan
  const balloon = result.balloon
  const leasing = result.leasing
  const loanOk = loan.valid
  const balloonOk = balloon.valid
  const leasingOk = leasing.valid

  if (loanOk && balloonOk) {
    const costDiff = Math.abs(balloon.totalEconomicCost - loan.totalEconomicCost)
    const costWord = balloon.totalEconomicCost >= loan.totalEconomicCost ? 'più' : 'meno'
    const rateDiff = Math.abs(balloon.monthlyOutflow - loan.monthlyOutflow)
    const ratePart =
      rateDiff === 0
        ? 'è uguale a quella del finanziamento classico'
        : `è ${balloon.monthlyOutflow < loan.monthlyOutflow ? 'più bassa' : 'più alta'} di ${formatMoney(rateDiff)}`
    out.push(
      `Il finanziamento con maxirata costa ${formatMoney(costDiff)} in ${costWord} del finanziamento classico, ma la rata mensile ${ratePart}. Il motivo principale è che ${formatMoney(balloon.finalPayment)} di capitale restano da pagare alla fine.`,
    )
  }

  if (leasingOk) {
    out.push(
      `Con il leasing paghi ${formatMoney(leasing.totalCashPaid - leasing.finalPayment)} durante il contratto e altri ${formatMoney(leasing.finalPayment)} per diventare proprietario.`,
    )
  }

  for (const kind of ['loan', 'balloon', 'leasing'] as const) {
    const m = result[kind]
    if (!m.valid) continue
    out.push(
      `${METHOD_WITH_ARTICLE[kind]} aggiunge ${formatMoney(m.extraCostVsCash)} al costo del veicolo: ${formatMoney(m.totalInterest)} di interessi e ${formatMoney(m.totalFees)} di spese.`,
    )
  }

  const firstMonthly = result.lowestMonthlyKinds[0]
  if (firstMonthly && !result.lowestCostFinancedKinds.includes(firstMonthly)) {
    const firstCost = result.lowestCostFinancedKinds[0]
    if (firstCost) {
      const a = METHOD_WITH_ARTICLE[firstMonthly]
      const b = METHOD_WITH_ARTICLE[firstCost].replace(/^Il /, 'il ')
      out.push(`${a} ha la rata più bassa, ma ${b} ha il costo totale più basso.`)
    }
  }

  if (loanOk || balloonOk || leasingOk) {
    const cashInitial = result.cash.valid ? Math.max(result.cash.initialCash, 0) : 0
    out.push(`Pagare in contanti evita interessi e spese, ma richiede ${formatMoney(cashInitial)} disponibili subito.`)
  }

  return out
}

export const FIXED_BULLETS = [
  'Un pagamento finale più alto abbassa la rata, ma lascia più debito per dopo.',
  'Una durata più lunga abbassa la rata, ma aumenta gli interessi totali.',
  'Un anticipo più alto riduce l\'importo finanziato e quindi gli interessi.',
  'Leasing e maxirata possono avere condizioni diverse su proprietà e restituzione: controlla il contratto.',
] as const
