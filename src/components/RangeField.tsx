import { useId, type CSSProperties } from 'react'

interface RangeFieldProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  format: (value: number) => string
  /** What a screen reader announces, when the visible value is terse. */
  spoken?: (value: number) => string
}

export function RangeField({ label, value, min, max, step, onChange, format, spoken = format }: RangeFieldProps) {
  const id = useId()
  const position = Math.min(max, Math.max(min, value))
  const filled = max > min ? ((position - min) / (max - min)) * 100 : 0

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 leading-none">
        <label htmlFor={id} className="text-[0.95rem] font-medium text-ink-soft">
          {label}
        </label>
        <output htmlFor={id} className="num text-lg leading-none font-semibold">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range -mt-2 block"
        min={min}
        max={max}
        step={step}
        value={position}
        aria-valuetext={spoken(value)}
        style={{ '--fill': `${filled}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}
