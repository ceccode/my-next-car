import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { InfoTip } from './InfoTip'
import { MoneyField, type MoneyFieldProps } from './MoneyField'

export interface SliderFieldProps extends Omit<MoneyFieldProps, 'min' | 'max' | 'step'> {
  min: number
  max: number
  step: number
  integer?: boolean
}

export function SliderField({ id, min, max, step, integer, ...field }: SliderFieldProps) {
  const clamped = Math.min(max, Math.max(min, field.value))
  const canSlide = max > min
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1">
        <Label htmlFor={`${id}-input`} className="text-xs text-muted-foreground">
          {field.label}
        </Label>
        {field.infoTerm ? <InfoTip term={field.infoTerm} /> : null}
      </div>
      {canSlide ? (
        <Slider
          value={[clamped]}
          min={min}
          max={max}
          step={step}
          aria-label={field.label}
          onValueChange={(values) => {
            const v = values[0]
            field.onChange(integer ? Math.round(v) : v)
          }}
        />
      ) : null}
      <div className="pt-0">
        <MoneyField
          id={`${id}-input`}
          label=""
          value={field.value}
          onChange={field.onChange}
          error={field.error}
        />
      </div>
    </div>
  )
}
