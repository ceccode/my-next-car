import { RangeField } from '@/components/RangeField'
import { DOWN_PAYMENT_STEP, type CommonTerms } from '@/domain/scenario/scenario'
import { formatMoneyRounded } from '@/lib/format'
import { TERMS } from '@/lib/strings'

const MONTHS = { min: 12, max: 96, step: 6 }
const RATE = { min: 0, max: 15, step: 0.1 }
const percent = new Intl.NumberFormat('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 2 })

interface TermsPanelProps {
  terms: CommonTerms
  /** The most a down payment can sensibly be, in euros. */
  maxDownPayment: number
  onChange: (changes: Partial<CommonTerms>) => void
}

/** The three sliders: docked under the thumb on phones, a card beside the results on larger screens. */
export function TermsPanel({ terms, maxDownPayment, onChange }: TermsPanelProps) {
  return (
    <section
      aria-label={TERMS.region}
      className="fixed inset-x-0 bottom-0 z-10 rounded-t-[1.75rem] bg-card px-5 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-dock)] md:static md:rounded-[var(--radius-card)] md:px-6 md:pt-5 md:pb-4 md:shadow-[var(--shadow-card)]"
    >
      <div className="mx-auto max-w-xl md:max-w-none md:space-y-1">
        <RangeField
          label={TERMS.downPayment}
          value={terms.downPayment}
          min={0}
          max={maxDownPayment}
          step={DOWN_PAYMENT_STEP}
          onChange={(downPayment) => onChange({ downPayment })}
          format={(euros) => formatMoneyRounded(euros * 100)}
        />
        <RangeField
          label={TERMS.duration}
          value={terms.months}
          {...MONTHS}
          onChange={(months) => onChange({ months })}
          format={TERMS.months}
          spoken={TERMS.monthsSpoken}
        />
        <RangeField
          label={TERMS.rate}
          value={terms.tanPercent}
          {...RATE}
          onChange={(tanPercent) => onChange({ tanPercent: Math.round(tanPercent * 100) / 100 })}
          format={(rate) => `${percent.format(rate)}%`}
        />
      </div>
    </section>
  )
}

