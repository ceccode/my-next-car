import { ChevronRight } from 'lucide-react'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import type { ComparisonResult, MethodKind } from '@/domain/financing/types'
import { barScale, keyInsight, rankByTotalCost, type Insight, type RankedOption } from '@/domain/summary/summary'
import { useFlip } from '@/hooks/useFlip'
import { formatMoneyRounded as money } from '@/lib/format'
import { METHOD, TOTALS } from '@/lib/strings'

interface CostRankingProps {
  result: ComparisonResult
  onOpen: (kind: MethodKind) => void
}

/** The heart of the app: every way of paying, ranked by what it costs in total. */
export function CostRanking({ result, onOpen }: CostRankingProps) {
  const options = rankByTotalCost(result)
  const flipRef = useFlip(options.map((option) => option.kind).join())
  const scale = barScale(
    result.netPurchasePrice,
    options.flatMap((option) => (option.available ? [option.total] : [])),
  )
  const cheapest = options[0]?.available ? options[0].kind : null
  const cheapestFinanced = result.lowestCostFinancedKinds[0] ?? null
  const insight = keyInsight(result)

  return (
    <section aria-labelledby="ranking-title" className="card px-5 pt-3.5 pb-3 sm:p-6">
      <h2 id="ranking-title" className="text-xl font-semibold tracking-tight">
        {TOTALS.title}
      </h2>
      {insight ? <p className="mt-1 leading-snug text-pretty text-ink-soft">{describe(insight)}</p> : null}

      {result.globalErrors.length > 0 ? (
        <p role="alert" className="mt-4 rounded-2xl bg-action-wash px-4 py-3 font-medium text-warn">
          {result.globalErrors[0]}
        </p>
      ) : (
        <>
          <Legend />
          <ol className="-mx-2 mt-1">
            {options.map((option) => (
              <li key={option.kind} ref={flipRef(option.kind)}>
                <OptionRow
                  option={option}
                  scale={scale}
                  badge={option.kind === cheapest ? TOTALS.cheapest : option.kind === cheapestFinanced ? TOTALS.cheapestFinanced : null}
                  isCheapest={option.kind === cheapest}
                  onOpen={() => onOpen(option.kind)}
                />
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  )
}

function describe(insight: Insight): string {
  switch (insight.kind) {
    case 'lowestMonthlyCostsMore':
      return TOTALS.lowestMonthlyCostsMore(insight.method, money(insight.monthly), money(insight.overpay), insight.versus)
    case 'financingPremium':
      return TOTALS.financingPremium(insight.method, money(insight.premium))
  }
}

function Legend() {
  return (
    <p aria-hidden className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-ink-soft">
      <LegendKey className="bg-price" label={TOTALS.legendPrice} />
      <LegendKey className="bg-extra" label={TOTALS.legendExtra} />
    </p>
  )
}

function LegendKey({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <i className={`size-2.5 rounded-full ${className}`} />
      {label}
    </span>
  )
}

interface OptionRowProps {
  option: RankedOption
  scale: number
  badge: string | null
  isCheapest: boolean
  onOpen: () => void
}

function OptionRow({ option, scale, badge, isCheapest, onOpen }: OptionRowProps) {
  const name = METHOD[option.kind].name
  const subtitle = !option.available
    ? TOTALS.unavailable
    : option.monthly === null
      ? METHOD[option.kind].short
      : `${money(option.monthly)}${TOTALS.perMonth}`

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={spokenSummary(option, badge)}
      className={`group grid w-full grid-cols-[1fr_auto] items-center gap-x-3 rounded-2xl px-2 py-1.5 text-left transition-colors hover:bg-ground ${isCheapest ? 'bg-action-wash/60' : ''}`}
    >
      <span className="min-w-0">
        <span className="block text-[1.05rem] font-semibold">{name}</span>
        <span className="num flex flex-wrap items-center gap-x-2 text-sm text-ink-soft">
          {subtitle}
          {badge ? <span className={isCheapest ? 'chip chip-strong' : 'chip'}>{badge}</span> : null}
        </span>
      </span>
      <span className="flex items-center gap-1">
        <span className="num text-xl font-semibold tracking-tight sm:text-2xl">
          {option.available ? <AnimatedNumber value={option.total} format={money} /> : '—'}
        </span>
        <ChevronRight className="size-5 text-ink-soft transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
      {option.available ? <CostBar option={option} scale={scale} isCheapest={isCheapest} /> : null}
    </button>
  )
}

function CostBar({ option, scale, isCheapest }: { option: Extract<RankedOption, { available: true }>; scale: number; isCheapest: boolean }) {
  const pricePart = ((option.total - option.extraCost) / scale) * 100
  const extraPart = (option.extraCost / scale) * 100
  return (
    <span aria-hidden className="col-span-2 mt-1.5 flex h-2.5 overflow-hidden rounded-full bg-ground">
      <span className={`bar-segment ${isCheapest ? 'bg-action' : 'bg-price'}`} style={{ width: `${pricePart}%` }} />
      {extraPart > 0 ? <span className="bar-segment ml-0.5 rounded-r-full bg-extra" style={{ width: `${extraPart}%` }} /> : null}
    </span>
  )
}

function spokenSummary(option: RankedOption, badge: string | null): string {
  const name = METHOD[option.kind].name
  if (!option.available) return `${name}: ${TOTALS.unavailable}. ${TOTALS.details}`
  const monthly = option.monthly === null ? '' : `, ${money(option.monthly)} ${TOTALS.perMonthSpoken}`
  return `${name}: ${money(option.total)} ${TOTALS.inTotal}${monthly}${badge ? `. ${badge}` : ''}. ${TOTALS.details}`
}
