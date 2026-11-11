import { BadgeCheck, Bookmark, CalendarDays, PiggyBank, Trash2, Wallet, RefreshCcw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedNumber } from '@/components/common/AnimatedNumber'
import { formatMoney } from '@/lib/format'
import { METHODS, SAVED, VERDICT } from '@/lib/strings'
import type { ComparisonResult, FinancedKind, FinancedResult, MethodKind } from '@/domain/financing/types'

interface VerdictProps {
  result: ComparisonResult
  hasBaseline: boolean
  onSaveScenario: () => void
  onUpdateScenario: () => void
  onRemoveScenario: () => void
}

const namesOf = (kinds: (MethodKind | FinancedKind)[]): string =>
  kinds.map((k) => METHODS[k]).join(' e ')

function Tile({
  icon,
  title,
  methodName,
  value,
  format,
  caption,
  extra,
}: {
  icon: React.ReactNode
  title: string
  methodName: string
  value: number
  format: (v: number) => string
  caption: string
  extra?: string
}) {
  return (
    <Card>
      <CardContent className="space-y-1 pt-6">
        <div className="flex items-center gap-2 text-muted-foreground">{icon}</div>
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <p className="text-sm font-medium">{methodName}</p>
        <AnimatedNumber value={value} format={format} className="text-2xl font-semibold tabular-nums" />
        <p className="text-xs text-muted-foreground">{caption}</p>
        {extra ? <p className="text-xs text-muted-foreground">{extra}</p> : null}
      </CardContent>
    </Card>
  )
}

export function Verdict({ result, hasBaseline, onSaveScenario, onUpdateScenario, onRemoveScenario }: VerdictProps) {
  if (result.globalErrors.length > 0) {
    return (
      <section aria-labelledby="verdict-title" className="space-y-3">
        <h2 id="verdict-title" className="text-2xl font-semibold">
          {VERDICT.title}
        </h2>
        {result.globalErrors.map((e) => (
          <Alert key={e} variant="destructive">
            <AlertDescription role="alert">{e}</AlertDescription>
          </Alert>
        ))}
      </section>
    )
  }

  const totalCostOf = (kind: MethodKind): number => {
    const m = result[kind]
    return m.valid ? m.totalEconomicCost : 0
  }
  const financedOf = (kind: FinancedKind): FinancedResult | null => {
    const m = result[kind]
    return m.valid ? m : null
  }

  const costKinds = result.lowestCostKinds
  const costValue = costKinds.length > 0 ? totalCostOf(costKinds[0]) : 0
  const financedKinds = result.lowestCostFinancedKinds
  const financedFirst = financedKinds.length > 0 ? financedOf(financedKinds[0]) : null
  const monthlyKinds = result.lowestMonthlyKinds
  const monthlyFirst = monthlyKinds.length > 0 ? financedOf(monthlyKinds[0]) : null
  const initialKinds = result.lowestInitialCashKinds
  const initialFirst = initialKinds.length > 0 ? financedOf(initialKinds[0]) : null

  const monthlyExtra = (() => {
    if (!monthlyFirst) return undefined
    const first = monthlyKinds[0]
    if (result.lowestCostFinancedKinds.includes(first)) return undefined
    const costFirst = result.lowestCostFinancedKinds[0]
    if (!costFirst) return undefined
    const costMethod = financedOf(costFirst)
    if (!costMethod) return undefined
    const diff = monthlyFirst.totalEconomicCost - costMethod.totalEconomicCost
    return VERDICT.tiles.lowestMonthlyExtra(formatMoney(diff))
  })()

  return (
    <section aria-labelledby="verdict-title" className="space-y-4">
      <h2 id="verdict-title" className="text-2xl font-semibold">
        {VERDICT.title}
      </h2>
      <p className="text-3xl font-semibold leading-snug">
        {VERDICT.headline(namesOf(costKinds), formatMoney(costValue))}
      </p>
      <p className="text-sm text-muted-foreground">{VERDICT.depends}</p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Tile
          icon={<PiggyBank aria-hidden />}
          title={VERDICT.tiles.totalCost}
          methodName={namesOf(costKinds)}
          value={costValue}
          format={formatMoney}
          caption={VERDICT.tiles.totalCostCaption}
        />
        {financedFirst ? (
          <Tile
            icon={<BadgeCheck aria-hidden />}
            title={VERDICT.tiles.cheapestFinanced}
            methodName={namesOf(financedKinds)}
            value={financedFirst.extraCostVsCash}
            format={(v) => `+${formatMoney(v)}`}
            caption={VERDICT.tiles.cheapestFinancedCaption}
          />
        ) : null}
        {monthlyFirst ? (
          <Tile
            icon={<CalendarDays aria-hidden />}
            title={VERDICT.tiles.lowestMonthly}
            methodName={namesOf(monthlyKinds)}
            value={monthlyFirst.monthlyOutflow}
            format={formatMoney}
            caption={VERDICT.tiles.lowestMonthlyCaption}
            extra={monthlyExtra}
          />
        ) : null}
        {initialFirst ? (
          <Tile
            icon={<Wallet aria-hidden />}
            title={VERDICT.tiles.lowestInitial}
            methodName={namesOf(initialKinds)}
            value={initialFirst.initialCash}
            format={formatMoney}
            caption={VERDICT.tiles.lowestInitialCaption}
          />
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={onSaveScenario}>
          <Bookmark aria-hidden />
          {SAVED.save}
        </Button>
        {hasBaseline ? (
          <>
            <p className="text-sm text-muted-foreground">{SAVED.comparing}</p>
            <Button variant="outline" onClick={onUpdateScenario}>
              <RefreshCcw aria-hidden />
              {SAVED.update}
            </Button>
            <Button variant="outline" onClick={onRemoveScenario}>
              <Trash2 aria-hidden />
              {SAVED.remove}
            </Button>
          </>
        ) : null}
      </div>
    </section>
  )
}
