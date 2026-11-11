import { Switch } from '@/components/ui/switch'
import { SliderField } from '@/components/common/SliderField'
import { MoneyField } from '@/components/common/MoneyField'
import { MESSAGES } from '@/domain/financing/validation'
import { FINANCING_FIELDS, SHARED } from '@/lib/strings'
import type { SimulationState } from '@/domain/financing/types'
import { BaseFinancedFields, fieldError, methodErrors, type MethodResult } from './financedFields'

interface BalloonFormProps {
  state: SimulationState
  netPurchasePrice: number
  balloon: MethodResult
  onBalloon: (patch: Partial<SimulationState['balloon']>) => void
}

export function BalloonForm({ state, netPurchasePrice, balloon, onBalloon }: BalloonFormProps) {
  const errors = methodErrors(balloon)
  const b = state.balloon
  return (
    <div className="space-y-4">
      <BaseFinancedFields
        prefix="balloon"
        fields={{
          downPayment: b.downPayment,
          months: b.months,
          tanPercent: b.tanPercent,
          upfrontFees: b.upfrontFees,
          monthlyFee: b.monthlyFee,
          quotedTaegPercent: b.quotedTaegPercent,
        }}
        netPurchasePrice={netPurchasePrice}
        errors={errors}
        downPaymentLabel={SHARED.downPayment}
        showTan
        onChange={(patch) => onBalloon(patch)}
      />
      <SliderField
        id="balloon-final"
        label={FINANCING_FIELDS.balloonPayment}
        infoTerm="Maxirata"
        value={b.balloonPayment}
        min={0}
        max={Math.max(0, Math.floor(netPurchasePrice / 100))}
        step={500}
        error={fieldError(errors, MESSAGES.finalPaymentTooHigh)}
        onChange={(value) => onBalloon({ balloonPayment: value })}
      />
      <div className="flex items-center gap-2">
        <Switch
          id="balloon-return"
          checked={b.returnOptionEnabled}
          onCheckedChange={(checked) => onBalloon({ returnOptionEnabled: checked })}
        />
        <label htmlFor="balloon-return" className="text-xs text-muted-foreground">
          {FINANCING_FIELDS.returnOption}
        </label>
      </div>
      {b.returnOptionEnabled ? (
        <MoneyField
          id="balloon-return-fees"
          label={FINANCING_FIELDS.returnFees}
          value={b.returnFees}
          min={0}
          onChange={(value) => onBalloon({ returnFees: value })}
        />
      ) : null}
      {!balloon.valid ? (
        <ul className="space-y-1">
          {errors.map((e) => (
            <li key={e} role="alert" className="text-xs text-destructive">
              {e}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
