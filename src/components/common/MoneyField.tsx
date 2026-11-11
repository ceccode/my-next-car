import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InfoTip } from './InfoTip'

export interface MoneyFieldProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  infoTerm?: string
  min?: number
  max?: number
  step?: number
  error?: string | null
}

function draftFrom(value: number): string {
  return value === 0 ? '' : String(value)
}

export function MoneyField({ id, label, value, onChange, infoTerm, min, max, step, error }: MoneyFieldProps) {
  const [draft, setDraft] = useState(() => draftFrom(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) setDraft(draftFrom(value))
  }, [value, focused])

  return (
    <div className="space-y-1.5">
      {label ? (
        <div className="flex items-center gap-1">
          <Label htmlFor={id} className="text-xs text-muted-foreground">
            {label}
          </Label>
          {infoTerm ? <InfoTip term={infoTerm} /> : null}
        </div>
      ) : null}
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={draft}
        placeholder="0"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => {
          setDraft(e.currentTarget.value)
          const n = e.currentTarget.valueAsNumber
          onChange(Number.isFinite(n) ? n : 0)
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          setDraft(draftFrom(value))
        }}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
