import type { ReactNode } from 'react'
import { AmountField } from '@/components/AmountInput'
import { Sheet } from '@/components/Sheet'
import type { Simulation } from '@/hooks/useSimulation'
import { formatMoneyRounded as money } from '@/lib/format'
import { ADJUSTMENTS } from '@/lib/strings'

interface AdjustmentsSheetProps {
  open: boolean
  onClose: () => void
  simulation: Simulation
}

/** Optional amounts that change the price or the cost of financing. */
export function AdjustmentsSheet({ open, onClose, simulation }: AdjustmentsSheetProps) {
  const { state, result, setAcquisition, setCommonTerms } = simulation
  const acquisition = state.acquisition
  const equity = result.tradeInEquity

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={ADJUSTMENTS.title}
      description={
        <>
          {ADJUSTMENTS.finalPrice} <strong className="num font-semibold text-ink">{money(result.netPurchasePrice)}</strong>
        </>
      }
    >
      <Group title={ADJUSTMENTS.incentives} hint={ADJUSTMENTS.incentivesHint}>
        <AmountField optional label={ADJUSTMENTS.discount} value={acquisition.discount} onChange={(discount) => setAcquisition({ discount })} />
        <AmountField
          optional
          label={ADJUSTMENTS.scrappageIncentive}
          value={acquisition.scrappageIncentive}
          onChange={(scrappageIncentive) => setAcquisition({ scrappageIncentive })}
        />
        <AmountField
          optional
          label={ADJUSTMENTS.otherIncentives}
          value={acquisition.otherIncentives}
          onChange={(otherIncentives) => setAcquisition({ otherIncentives })}
        />
        <AmountField
          optional
          label={ADJUSTMENTS.additionalCosts}
          value={acquisition.additionalCosts}
          onChange={(additionalCosts) => setAcquisition({ additionalCosts })}
        />
      </Group>

      <Group title={ADJUSTMENTS.tradeIn} hint={ADJUSTMENTS.tradeInHint}>
        <AmountField
          optional
          label={ADJUSTMENTS.tradeInValue}
          value={acquisition.tradeInValue}
          onChange={(tradeInValue) => setAcquisition({ tradeInValue })}
        />
        <AmountField
          optional
          label={ADJUSTMENTS.tradeInDebt}
          value={acquisition.tradeInOutstandingLoan}
          onChange={(tradeInOutstandingLoan) => setAcquisition({ tradeInOutstandingLoan })}
        />
        {equity !== 0 ? (
          <p className="notice bg-surface sm:col-span-2">
            {equity > 0 ? ADJUSTMENTS.tradeInCovers(money(equity)) : ADJUSTMENTS.tradeInShortfall(money(-equity))}
          </p>
        ) : null}
      </Group>

      <Group title={ADJUSTMENTS.fees} hint={ADJUSTMENTS.feesHint}>
        <AmountField
          optional
          label={ADJUSTMENTS.upfrontFees}
          value={state.shared.upfrontFees}
          onChange={(upfrontFees) => setCommonTerms({ upfrontFees })}
        />
        <AmountField
          optional
          decimals
          label={ADJUSTMENTS.monthlyFee}
          value={state.shared.monthlyFee}
          onChange={(monthlyFee) => setCommonTerms({ monthlyFee })}
        />
      </Group>
      <div className="h-4" />
    </Sheet>
  )
}

function Group({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <fieldset className="mt-6 first:mt-0">
      <legend className="text-lg font-semibold">{title}</legend>
      <p className="mt-0.5 text-sm text-ink-soft">{hint}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}
