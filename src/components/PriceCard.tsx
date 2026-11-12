import { ChevronRight, Pencil, SlidersHorizontal } from 'lucide-react'
import { AmountInput } from '@/components/AmountInput'
import { formatMoneyRounded } from '@/lib/format'
import { PRICE } from '@/lib/strings'

interface PriceCardProps {
  listPrice: number
  netPurchasePrice: number
  adjustments: number
  isExample: boolean
  onListPriceChange: (price: number) => void
  onOpenAdjustments: () => void
}

export function PriceCard({ listPrice, netPurchasePrice, adjustments, isExample, onListPriceChange, onOpenAdjustments }: PriceCardProps) {
  const id = 'list-price'
  const netPriceDiffers = netPurchasePrice !== Math.round(listPrice * 100)

  return (
    <section aria-labelledby={`${id}-label`} className="card">
      <div className="px-5 pt-3 pb-2 sm:px-6 sm:pt-5 sm:pb-3">
        <div className="flex items-center justify-between gap-3">
          <label id={`${id}-label`} htmlFor={id} className="text-sm font-medium text-ink-soft">
            {PRICE.label} · {PRICE.vat}
          </label>
          {isExample ? <span className="chip">{PRICE.example}</span> : null}
        </div>
        <div className="flex items-baseline gap-1.5">
          <AmountInput
            id={id}
            value={listPrice}
            onChange={onListPriceChange}
            className="text-[2.5rem] leading-tight font-semibold tracking-tight caret-action underline decoration-line decoration-dashed decoration-2 underline-offset-[0.18em] focus:decoration-solid focus:decoration-action-strong sm:text-5xl"
          />
          <span aria-hidden className="text-2xl font-semibold text-ink-soft">
            €
          </span>
          <label htmlFor={id} className="icon-button ml-auto self-center bg-transparent shadow-none">
            <Pencil className="size-5 text-action-ink" aria-hidden />
          </label>
        </div>
        {netPriceDiffers ? (
          <p className="num text-sm text-ink-soft">
            {PRICE.netPrice} <strong className="font-semibold text-ink">{formatMoneyRounded(netPurchasePrice)}</strong>
          </p>
        ) : null}
      </div>
      <button type="button" onClick={onOpenAdjustments} className="row-button rounded-b-[var(--radius-card)] border-t border-line">
        <SlidersHorizontal className="size-5 text-action-ink" aria-hidden />
        <span className="flex-1 font-medium">{PRICE.adjustments}</span>
        <span className="text-sm whitespace-nowrap text-ink-soft">
          {adjustments > 0 ? (
            <>
              <span aria-hidden className="num">
                {adjustments}
              </span>
              <span className="sr-only">{PRICE.adjustmentsCount(adjustments)}</span>
            </>
          ) : (
            PRICE.adjustmentsEmpty
          )}
        </span>
        <ChevronRight className="size-5 text-ink-soft" aria-hidden />
      </button>
    </section>
  )
}
