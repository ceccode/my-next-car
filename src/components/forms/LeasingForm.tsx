import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { SliderField } from '@/components/common/SliderField'
import { MoneyField } from '@/components/common/MoneyField'
import { MESSAGES } from '@/domain/financing/validation'
import { FINANCING_FIELDS } from '@/lib/strings'
import type { SimulationState } from '@/domain/financing/types'
import { BaseFinancedFields, fieldError, methodErrors, type MethodResult } from './financedFields'

interface LeasingFormProps {
  state: SimulationState
  netPurchasePrice: number
  leasing: MethodResult
  onLeasing: (patch: Partial<SimulationState['leasing']>) => void
}

export function LeasingForm({ state, netPurchasePrice, leasing, onLeasing }: LeasingFormProps) {
  const errors = methodErrors(leasing)
  const e = state.leasing
  const calculated = e.mode === 'calculated'
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">{FINANCING_FIELDS.leasingMode}</p>
        <Tabs value={e.mode} onValueChange={(val) => onLeasing({ mode: val as 'calculated' | 'quoted' })}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="calculated">{FINANCING_FIELDS.leasingModeCalculated}</TabsTrigger>
            <TabsTrigger value="quoted">{FINANCING_FIELDS.leasingModeQuoted}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <BaseFinancedFields
        prefix="leasing"
        fields={{
          downPayment: e.initialPayment,
          months: e.months,
          tanPercent: e.tanPercent,
          upfrontFees: e.upfrontFees,
          monthlyFee: e.monthlyFee,
          quotedTaegPercent: e.quotedTaegPercent,
        }}
        netPurchasePrice={netPurchasePrice}
        errors={errors}
        downPaymentLabel={FINANCING_FIELDS.initialPayment}
        showTan={calculated}
        onChange={(patch) => {
          const p: Partial<SimulationState['leasing']> = {}
          if (patch.downPayment !== undefined) p.initialPayment = patch.downPayment
          if (patch.months !== undefined) p.months = patch.months
          if (patch.tanPercent !== undefined) p.tanPercent = patch.tanPercent
          if (patch.upfrontFees !== undefined) p.upfrontFees = patch.upfrontFees
          if (patch.monthlyFee !== undefined) p.monthlyFee = patch.monthlyFee
          if (patch.quotedTaegPercent !== undefined) p.quotedTaegPercent = patch.quotedTaegPercent
          onLeasing(p)
        }}
      />
      {!calculated ? (
        <MoneyField
          id="leasing-quoted-payment"
          label={FINANCING_FIELDS.quotedMonthlyPayment}
          infoTerm="Rata"
          value={e.quotedMonthlyPayment}
          min={0}
          error={fieldError(errors, MESSAGES.quotedMonthlyPayment)}
          onChange={(value) => onLeasing({ quotedMonthlyPayment: value })}
        />
      ) : null}
      <SliderField
        id="leasing-buyout"
        label={FINANCING_FIELDS.buyout}
        infoTerm="Riscatto"
        value={e.buyout}
        min={0}
        max={Math.max(0, Math.floor(netPurchasePrice / 100))}
        step={500}
        error={fieldError(errors, MESSAGES.finalPaymentTooHigh)}
        onChange={(value) => onLeasing({ buyout: value })}
      />
      <div className="flex items-center gap-2">
        <Switch
          id="leasing-return"
          checked={e.returnOptionEnabled}
          onCheckedChange={(checked) => onLeasing({ returnOptionEnabled: checked })}
        />
        <label htmlFor="leasing-return" className="text-xs text-muted-foreground">
          {FINANCING_FIELDS.returnOption}
        </label>
      </div>
      {e.returnOptionEnabled ? (
        <MoneyField
          id="leasing-return-fees"
          label={FINANCING_FIELDS.returnFees}
          value={e.returnFees}
          min={0}
          onChange={(value) => onLeasing({ returnFees: value })}
        />
      ) : null}
      {!leasing.valid ? (
        <ul className="space-y-1">
          {errors.map((msg) => (
            <li key={msg} role="alert" className="text-xs text-destructive">
              {msg}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
