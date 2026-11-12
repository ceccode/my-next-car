import type { ReactNode } from 'react'
import { AmountField } from '@/components/AmountInput'
import { Sheet } from '@/components/Sheet'
import { Switch } from '@/components/Switch'
import type { CashResult, FinancedResult, MethodKind } from '@/domain/financing/types'
import type { Simulation } from '@/hooks/useSimulation'
import { formatMoneyRounded as money, formatPercent } from '@/lib/format'
import { DETAIL, METHOD } from '@/lib/strings'

interface MethodSheetProps {
  kind: MethodKind | null
  simulation: Simulation
  onClose: () => void
}

/** What one way of paying costs, and the fields of a dealer quote for it. */
export function MethodSheet({ kind, simulation, onClose }: MethodSheetProps) {
  const method = kind ? simulation.result[kind] : null
  return (
    <Sheet open={kind !== null} onClose={onClose} title={kind ? METHOD[kind].name : ''} description={kind ? METHOD[kind].tagline : null}>
      {method ? (
        <>
          {!method.valid ? (
            <Problems errors={method.errors} />
          ) : method.kind === 'cash' ? (
            <CashSummary cash={method} />
          ) : (
            <FinancedSummary method={method} />
          )}
          {kind === 'loan' ? <LoanQuote simulation={simulation} /> : null}
          {kind === 'balloon' ? <BalloonQuote simulation={simulation} /> : null}
          {kind === 'leasing' ? <LeasingQuote simulation={simulation} /> : null}
          <div className="h-2" />
        </>
      ) : null}
    </Sheet>
  )
}

function Problems({ errors }: { errors: string[] }) {
  return (
    <div role="alert" className="rounded-2xl bg-action-wash px-4 py-3 text-warn">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  )
}

function CashSummary({ cash }: { cash: CashResult }) {
  return (
    <div className="card rounded-3xl p-5">
      <p className="text-ink-soft">{DETAIL.payNow}</p>
      <p className="num text-4xl font-semibold tracking-tight">{money(cash.initialCash)}</p>
      <p className="mt-3 text-ink-soft">{DETAIL.cashNote}</p>
    </div>
  )
}

function FinancedSummary({ method }: { method: FinancedResult }) {
  const taeg = method.estimatedTaegPercent
  return (
    <>
      <div className="card rounded-3xl p-5">
        <p className="text-ink-soft">{DETAIL.perMonth}</p>
        <p className="num text-4xl font-semibold tracking-tight">
          {money(method.monthlyOutflow)}
          <span className="ml-1 text-lg font-medium text-ink-soft">× {method.months}</span>
        </p>
        <dl className="mt-3 divide-y divide-line border-t border-line">
          <Line label={DETAIL.atSigning} value={money(method.initialCash)} />
          {method.finalPayment > 0 ? <Line label={DETAIL.finalPayment(method.kind)} value={money(method.finalPayment)} /> : null}
          <Line label={DETAIL.extraCost} value={money(method.extraCostVsCash)} />
          <Line label={DETAIL.total} value={money(method.totalEconomicCost)} strong />
        </dl>
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        {DETAIL.rates(formatPercent(method.nominalRatePercent), method.nominalRateIsEstimated, taeg === null ? null : formatPercent(taeg))}{' '}
        {DETAIL.taegEstimate}
      </p>
      {method.taegComparison !== 'none' && taeg !== null ? (
        <p role="status" className={`notice mt-3 ${method.taegComparison === 'aligned' ? 'bg-good-wash text-good' : 'bg-action-wash text-warn'}`}>
          {DETAIL.taegComparison[method.taegComparison](formatPercent(method.quotedTaegPercent), formatPercent(taeg))}
        </p>
      ) : null}
      {method.costIfReturned !== null ? <p className="notice mt-3 bg-surface">{DETAIL.returned(money(method.costIfReturned))}</p> : null}
    </>
  )
}

function Line({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 py-2.5 ${strong ? 'text-lg font-semibold' : ''}`}>
      <dt className={strong ? '' : 'text-ink-soft'}>{label}</dt>
      <dd className="num text-right font-semibold">{value}</dd>
    </div>
  )
}

function QuoteFields({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <section className="mt-6">
      <h3 className="mb-2 text-lg font-semibold">{DETAIL.fromQuote}</h3>
      <div className="space-y-3">{children}</div>
      {note ? <p className="mt-4 text-sm text-ink-soft">{note}</p> : null}
    </section>
  )
}

function QuotedTaeg({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return <AmountField label={DETAIL.quotedTaeg} unit="%" decimals optional value={value} onChange={onChange} hint={DETAIL.quotedTaegHint} />
}

function ReturnOption({ enabled, fees, onChange }: { enabled: boolean; fees: number; onChange: (changes: { returnOptionEnabled?: boolean; returnFees?: number }) => void }) {
  return (
    <>
      <Switch label={DETAIL.returnOption} checked={enabled} onChange={(returnOptionEnabled) => onChange({ returnOptionEnabled })} />
      {enabled ? <AmountField label={DETAIL.returnFees} value={fees} onChange={(returnFees) => onChange({ returnFees })} /> : null}
    </>
  )
}

function LoanQuote({ simulation }: { simulation: Simulation }) {
  const loan = simulation.state.loan
  return (
    <QuoteFields>
      <QuotedTaeg value={loan.quotedTaegPercent} onChange={(quotedTaegPercent) => simulation.setLoan({ quotedTaegPercent })} />
    </QuoteFields>
  )
}

function BalloonQuote({ simulation }: { simulation: Simulation }) {
  const balloon = simulation.state.balloon
  return (
    <QuoteFields note={DETAIL.balloonEnd}>
      <AmountField
        label={DETAIL.balloonPayment}
        value={balloon.balloonPayment}
        onChange={(balloonPayment) => simulation.setBalloon({ balloonPayment })}
        hint={DETAIL.balloonPaymentHint}
      />
      <QuotedTaeg value={balloon.quotedTaegPercent} onChange={(quotedTaegPercent) => simulation.setBalloon({ quotedTaegPercent })} />
      <ReturnOption enabled={balloon.returnOptionEnabled} fees={balloon.returnFees} onChange={simulation.setBalloon} />
    </QuoteFields>
  )
}

function LeasingQuote({ simulation }: { simulation: Simulation }) {
  const leasing = simulation.state.leasing
  const quoted = leasing.mode === 'quoted'
  return (
    <QuoteFields note={DETAIL.leasingOwnership}>
      <Switch
        label={DETAIL.quotedMonthly}
        hint={DETAIL.quotedMonthlyHint}
        checked={quoted}
        onChange={(isQuoted) => simulation.setLeasing({ mode: isQuoted ? 'quoted' : 'calculated' })}
      />
      {quoted ? (
        <AmountField
          label={DETAIL.quotedMonthlyPayment}
          value={leasing.quotedMonthlyPayment}
          onChange={(quotedMonthlyPayment) => simulation.setLeasing({ quotedMonthlyPayment })}
        />
      ) : null}
      <AmountField label={DETAIL.buyout} value={leasing.buyout} onChange={(buyout) => simulation.setLeasing({ buyout })} hint={DETAIL.buyoutHint} />
      <QuotedTaeg value={leasing.quotedTaegPercent} onChange={(quotedTaegPercent) => simulation.setLeasing({ quotedTaegPercent })} />
      <ReturnOption enabled={leasing.returnOptionEnabled} fees={leasing.returnFees} onChange={simulation.setLeasing} />
    </QuoteFields>
  )
}
