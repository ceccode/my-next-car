import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedNumber } from '@/components/common/AnimatedNumber'
import { InfoTip } from '@/components/common/InfoTip'
import { formatMoney, formatPercent } from '@/lib/format'
import { CARDS, FINANCING_FIELDS, METHODS, SAVED, TAEG_COMPARISON, TABLE } from '@/lib/strings'
import type {
  CashResult,
  ComparisonResult,
  FinancedKind,
  FinancedResult,
  MethodKind,
  MethodInvalid,
} from '@/domain/financing/types'

type Method = CashResult | FinancedResult

interface ComparisonCardsProps {
  result: ComparisonResult
  baselineResult: ComparisonResult | null
}

function DiffLine({ current, baseline }: { current: number; baseline: number }) {
  const diff = current - baseline
  if (diff === 0) return null
  return diff < 0 ? (
    <p className="text-xs tabular-nums text-green-700">{SAVED.less(formatMoney(-diff))}</p>
  ) : (
    <p className="text-xs tabular-nums text-red-700">{SAVED.more(formatMoney(diff))}</p>
  )
}

function Row({ label, infoTerm, children }: { label: string; infoTerm?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1">
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        {label}
        {infoTerm ? <InfoTip term={infoTerm} /> : null}
      </span>
      <span className="text-right text-sm tabular-nums">{children}</span>
    </div>
  )
}

function CardShell({
  title,
  badges,
  invalid,
  children,
}: {
  title: string
  badges: React.ReactNode
  invalid: boolean
  children: React.ReactNode
}) {
  return (
    <Card className={invalid ? 'opacity-70' : undefined}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          {badges}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">{children}</CardContent>
    </Card>
  )
}

function CashCard({
  cash,
  lowestCost,
  baselineCash,
}: {
  cash: Method
  lowestCost: boolean
  baselineCash: Method | null
}) {
  const c = cash as CashResult
  const badges = lowestCost ? <Badge>{CARDS.badgeLowestCost}</Badge> : null
  return (
    <CardShell title={METHODS.cash} badges={badges} invalid={false}>
      <p className="mb-1 text-xs text-muted-foreground">{CARDS.totalCost}</p>
      <AnimatedNumber value={c.totalEconomicCost} format={formatMoney} className="text-3xl font-semibold tabular-nums" />
      {baselineCash ? (
        <DiffLine current={c.totalEconomicCost} baseline={(baselineCash as CashResult).totalEconomicCost} />
      ) : null}
      <Row label={CARDS.monthlyOutflow}>{CARDS.noMonthlyOutflow}</Row>
      {c.initialCash < 0 ? (
        <Row label={CARDS.receive}>{formatMoney(-c.initialCash)}</Row>
      ) : (
        <Row label={CARDS.initialCash}>{formatMoney(c.initialCash)}</Row>
      )}
      <Row label={CARDS.months}>{TABLE.dash}</Row>
      <Row label={CARDS.finalPayment}>{CARDS.noFinalPayment}</Row>
      <Row label={CARDS.totalInterest} infoTerm="Interessi totali">{formatMoney(0)}</Row>
      <Row label={CARDS.fees}>{formatMoney(0)}</Row>
      <Row label={CARDS.tan}>{TABLE.dash}</Row>
      <Row label={CARDS.estimatedTaeg} infoTerm="TAEG stimato">{TABLE.dash}</Row>
      <Row label={CARDS.extraVsCash}>{CARDS.reference}</Row>
    </CardShell>
  )
}

function FinancedCard({
  kind,
  method,
  result,
  baselineMethod,
}: {
  kind: FinancedKind
  method: Method
  result: ComparisonResult
  baselineMethod: Method | null
}) {
  const m = method as FinancedResult
  const lowestCost = result.lowestCostKinds.includes(kind)
  const cashOnlyLowest = result.lowestCostKinds.length === 1 && result.lowestCostKinds[0] === 'cash'
  const cheapestFinanced = cashOnlyLowest && result.lowestCostFinancedKinds.includes(kind)
  const lowestMonthly = result.lowestMonthlyKinds.includes(kind)
  const finalLabel = kind === 'balloon' ? CARDS.finalPaymentBalloon : kind === 'leasing' ? CARDS.finalPaymentLeasing : CARDS.finalPayment

  const badges = (
    <>
      {lowestCost ? <Badge>{CARDS.badgeLowestCost}</Badge> : null}
      {cheapestFinanced ? <Badge>{CARDS.badgeCheapestFinanced}</Badge> : null}
      {lowestMonthly ? <Badge variant="secondary">{CARDS.badgeLowestMonthly}</Badge> : null}
    </>
  )

  const taegText =
    m.estimatedTaegPercent === null ? null : (() => {
      const q = m.quotedTaegPercent
      const est = formatPercent(m.estimatedTaegPercent as number)
      const quoted = formatPercent(q)
      if (m.taegComparison === 'aligned') return TAEG_COMPARISON.aligned(quoted, est)
      if (m.taegComparison === 'higher') return TAEG_COMPARISON.higher(quoted, est)
      if (m.taegComparison === 'lower') return TAEG_COMPARISON.lower(quoted, est)
      return null
    })()

  return (
    <CardShell title={METHODS[kind]} badges={badges} invalid={false}>
      <p className="mb-1 text-xs text-muted-foreground">{CARDS.totalCost}</p>
      <AnimatedNumber value={m.totalEconomicCost} format={formatMoney} className="text-3xl font-semibold tabular-nums" />
      {baselineMethod ? (
        <DiffLine current={m.totalEconomicCost} baseline={(baselineMethod as FinancedResult).totalEconomicCost} />
      ) : null}
      <Row label={CARDS.monthlyOutflow} infoTerm="Rata">
        <AnimatedNumber value={m.monthlyOutflow} format={formatMoney} />
      </Row>
      {baselineMethod ? (
        <DiffLine current={m.monthlyOutflow} baseline={(baselineMethod as FinancedResult).monthlyOutflow} />
      ) : null}
      <Row label={CARDS.initialCash}>{formatMoney(m.initialCash)}</Row>
      <Row label={CARDS.months}>{m.months} {CARDS.monthsSuffix}</Row>
      {kind === 'loan' ? (
        <Row label={CARDS.finalPayment}>{CARDS.noFinalPayment}</Row>
      ) : (
        <Row label={`${CARDS.finalPayment} (${finalLabel})`} infoTerm={kind === 'balloon' ? 'Maxirata' : 'Riscatto'}>
          {formatMoney(m.finalPayment)}
        </Row>
      )}
      <Row label={CARDS.totalInterest} infoTerm="Interessi totali">
        <AnimatedNumber value={m.totalInterest} format={formatMoney} />
      </Row>
      <Row label={CARDS.fees}>{formatMoney(m.totalFees)}</Row>
      <Row label={m.nominalRateIsEstimated ? FINANCING_FIELDS.tanImplicit : CARDS.tan} infoTerm="TAN (Tasso Annuo Nominale)">
        {formatPercent(m.nominalRatePercent)}
      </Row>
      <div className="py-1">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {CARDS.estimatedTaeg}
          <InfoTip term="TAEG stimato" />
        </span>
        <span className="text-right text-sm tabular-nums">
          {m.estimatedTaegPercent === null ? CARDS.nd : formatPercent(m.estimatedTaegPercent)}
        </span>
        {taegText ? <p className="mt-1 text-xs text-muted-foreground">{taegText}</p> : null}
      </div>
      <Row label={CARDS.extraVsCash} infoTerm="Costo totale">
        {m.extraCostVsCash === 0 ? CARDS.sameAsCash : `+${formatMoney(m.extraCostVsCash)}`}
      </Row>
      {m.returnOptionEnabled && m.costIfReturned !== null ? (
        <p className="pt-2 text-xs text-muted-foreground">{CARDS.returned(formatMoney(m.costIfReturned))}</p>
      ) : null}
      {kind === 'balloon' ? (
        <Accordion type="single" collapsible className="pt-2">
          <AccordionItem value="end">
            <AccordionTrigger className="text-xs text-muted-foreground">
              {CARDS.balloonAccordionTitle}
            </AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
                {CARDS.balloonEndOptions.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
      {kind === 'leasing' ? (
        <p className="pt-2 text-xs text-muted-foreground">{CARDS.leasingNote}</p>
      ) : null}
    </CardShell>
  )
}

export function ComparisonCards({ result, baselineResult }: ComparisonCardsProps) {
  if (result.globalErrors.length > 0) return null

  const baselineMethodOf = (kind: MethodKind): Method | null => {
    if (!baselineResult) return null
    const m = baselineResult[kind]
    if (!m.valid) return null
    return m
  }

  const loan = result.loan.valid ? (
    <FinancedCard kind="loan" method={result.loan} result={result} baselineMethod={baselineMethodOf('loan')} />
  ) : null
  const balloon = result.balloon.valid ? (
    <FinancedCard kind="balloon" method={result.balloon} result={result} baselineMethod={baselineMethodOf('balloon')} />
  ) : null
  const leasing = result.leasing.valid ? (
    <FinancedCard kind="leasing" method={result.leasing} result={result} baselineMethod={baselineMethodOf('leasing')} />
  ) : null

  const invalidCard = (kind: MethodKind, m: MethodInvalid) => (
    <CardShell title={METHODS[kind]} badges={null} invalid>
      <ul className="space-y-1">
        {m.errors.map((e) => (
          <li key={e} role="alert" className="text-xs text-destructive">
            {e}
          </li>
        ))}
      </ul>
    </CardShell>
  )

  return (
    <section aria-label="Confronto dei metodi" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {result.cash.valid ? (
        <CashCard
          cash={result.cash}
          lowestCost={result.lowestCostKinds.includes('cash')}
          baselineCash={baselineMethodOf('cash') as CashResult | null}
        />
      ) : (
        invalidCard('cash', result.cash as MethodInvalid)
      )}
      {loan ?? invalidCard('loan', result.loan as MethodInvalid)}
      {balloon ?? invalidCard('balloon', result.balloon as MethodInvalid)}
      {leasing ?? invalidCard('leasing', result.leasing as MethodInvalid)}
    </section>
  )
}
