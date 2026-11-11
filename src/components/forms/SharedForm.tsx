import { Button } from '@/components/ui/button'
import { SliderField } from '@/components/common/SliderField'
import { MoneyField } from '@/components/common/MoneyField'
import { SHARED } from '@/lib/strings'
import type { Cents, SimulationState } from '@/domain/financing/types'

interface SharedFormProps {
  state: SimulationState
  netPurchasePrice: Cents
  onShared: (patch: Partial<SimulationState['shared']>) => void
  onApplyToAll: () => void
}

export function SharedForm({ state, netPurchasePrice, onShared, onApplyToAll }: SharedFormProps) {
  const s = state.shared
  const maxAmount = Math.max(0, Math.floor(netPurchasePrice / 100))
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">{SHARED.title}</h3>
      <SliderField
        id="shared-down-payment"
        label={SHARED.downPayment}
        infoTerm="Anticipo"
        value={s.downPayment}
        min={0}
        max={maxAmount}
        step={500}
        onChange={(value) => onShared({ downPayment: value })}
      />
      <SliderField
        id="shared-months"
        label={SHARED.months}
        value={s.months}
        min={6}
        max={120}
        step={6}
        integer
        onChange={(value) => onShared({ months: value })}
      />
      <SliderField
        id="shared-tan"
        label={SHARED.tanPercent}
        infoTerm="TAN (Tasso Annuo Nominale)"
        value={s.tanPercent}
        min={0}
        max={15}
        step={0.05}
        onChange={(value) => onShared({ tanPercent: value })}
      />
      <MoneyField
        id="shared-upfront"
        label={SHARED.upfrontFees}
        infoTerm="Spese iniziali"
        value={s.upfrontFees}
        min={0}
        onChange={(value) => onShared({ upfrontFees: value })}
      />
      <MoneyField
        id="shared-monthly-fee"
        label={SHARED.monthlyFee}
        infoTerm="Spese mensili"
        value={s.monthlyFee}
        min={0}
        onChange={(value) => onShared({ monthlyFee: value })}
      />
      <Button variant="secondary" onClick={onApplyToAll}>
        {SHARED.applyToAll}
      </Button>
    </div>
  )
}
