import { useId, useState, type ReactNode } from 'react'
import { editableAmount, formatAmount, parseAmount } from '@/lib/amount'

interface AmountInputProps {
  id: string
  value: number
  onChange: (value: number) => void
  decimals?: boolean
  optional?: boolean
  describedBy?: string
  className?: string
}

/**
 * A number field for amounts: grouped at rest, plain while typing, numeric keypad on phones.
 * It sizes itself to its content, so a unit placed after it sits right next to the number.
 */
export function AmountInput({ id, value, onChange, decimals = false, optional = false, describedBy, className = '' }: AmountInputProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const shown = draft ?? (optional && value === 0 ? '' : formatAmount(value, { decimals }))

  return (
    <span className="inline-grid min-w-0 max-w-full">
      <span aria-hidden className={`num invisible col-start-1 row-start-1 whitespace-pre ${className}`}>
        {shown || '0'}
      </span>
      <input
        id={id}
        size={1}
        inputMode={decimals ? 'decimal' : 'numeric'}
        enterKeyHint="done"
        autoComplete="off"
        value={shown}
        placeholder={optional ? '0' : undefined}
        aria-describedby={describedBy}
        onFocus={(event) => {
          setDraft(editableAmount(value))
          const input = event.currentTarget
          requestAnimationFrame(() => input.select())
        }}
        onBlur={() => setDraft(null)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur()
        }}
        onChange={(event) => {
          setDraft(event.target.value)
          onChange(parseAmount(event.target.value))
        }}
        className={`num col-start-1 row-start-1 w-full min-w-0 bg-transparent outline-none placeholder:font-normal placeholder:text-ink-soft ${className}`}
      />
    </span>
  )
}

interface AmountFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  hint?: ReactNode
  unit?: string
  decimals?: boolean
  optional?: boolean
}

/** A labelled, boxed amount field, as used in the sheets. */
export function AmountField({ label, value, onChange, hint, unit = '€', decimals, optional }: AmountFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  return (
    <div className="rounded-2xl border border-line bg-card px-4 pt-2.5 pb-2 focus-within:border-action-strong">
      <label htmlFor={id} className="block text-sm font-medium text-ink-soft">
        {label}
      </label>
      <label htmlFor={id} className="flex cursor-text items-baseline gap-1.5 py-1 text-lg font-semibold">
        <AmountInput
          id={id}
          value={value}
          onChange={onChange}
          decimals={decimals}
          optional={optional}
          describedBy={hint ? hintId : undefined}
        />
        <span aria-hidden className="text-ink-soft">
          {unit}
        </span>
      </label>
      {hint ? (
        <p id={hintId} className="text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
