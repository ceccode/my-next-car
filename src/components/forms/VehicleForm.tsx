import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MoneyField } from '@/components/common/MoneyField'
import { InfoTip } from '@/components/common/InfoTip'
import { formatMoney } from '@/lib/format'
import { VEHICLE_CONDITIONS, VEHICLE_FIELDS, VEHICLE_TYPES } from '@/lib/strings'
import type { Cents, SimulationState } from '@/domain/financing/types'

interface VehicleFormProps {
  state: SimulationState
  netPurchasePrice: Cents
  onVehicle: (patch: Partial<SimulationState['vehicle']>) => void
  onAcquisition: (patch: Partial<SimulationState['acquisition']>) => void
}

export function VehicleForm({ state, netPurchasePrice, onVehicle, onAcquisition }: VehicleFormProps) {
  const v = state.vehicle
  const a = state.acquisition
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="vehicle-name" className="text-xs text-muted-foreground">
          {VEHICLE_FIELDS.name}
        </label>
        <Input
          id="vehicle-name"
          type="text"
          maxLength={60}
          value={v.name}
          onChange={(e) => onVehicle({ name: e.currentTarget.value })}
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">{VEHICLE_FIELDS.type}</p>
        <Tabs value={v.type} onValueChange={(val) => onVehicle({ type: val as SimulationState['vehicle']['type'] })}>
          <TabsList className="w-full grid grid-cols-4">
            {(Object.keys(VEHICLE_TYPES) as (keyof typeof VEHICLE_TYPES)[]).map((t) => (
              <TabsTrigger key={t} value={t}>
                {VEHICLE_TYPES[t]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">{VEHICLE_FIELDS.condition}</p>
        <Tabs value={v.condition} onValueChange={(val) => onVehicle({ condition: val as SimulationState['vehicle']['condition'] })}>
          <TabsList className="w-full grid grid-cols-2">
            {(Object.keys(VEHICLE_CONDITIONS) as (keyof typeof VEHICLE_CONDITIONS)[]).map((c) => (
              <TabsTrigger key={c} value={c}>
                {VEHICLE_CONDITIONS[c]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <MoneyField
        id="list-price"
        label={VEHICLE_FIELDS.listPrice}
        value={a.listPrice}
        min={0}
        max={10000000}
        onChange={(value) => onAcquisition({ listPrice: value })}
      />
      <MoneyField
        id="discount"
        label={VEHICLE_FIELDS.discount}
        value={a.discount}
        min={0}
        onChange={(value) => onAcquisition({ discount: value })}
      />
      <MoneyField
        id="scrappage"
        label={VEHICLE_FIELDS.scrappageIncentive}
        value={a.scrappageIncentive}
        min={0}
        onChange={(value) => onAcquisition({ scrappageIncentive: value })}
      />
      <MoneyField
        id="other-incentives"
        label={VEHICLE_FIELDS.otherIncentives}
        value={a.otherIncentives}
        min={0}
        onChange={(value) => onAcquisition({ otherIncentives: value })}
      />
      <MoneyField
        id="additional-costs"
        label={VEHICLE_FIELDS.additionalCosts}
        value={a.additionalCosts}
        min={0}
        onChange={(value) => onAcquisition({ additionalCosts: value })}
      />

      <div className="flex items-center gap-1 border-t pt-3">
        <p className="text-sm font-medium tabular-nums">
          {VEHICLE_FIELDS.netPrice} {formatMoney(netPurchasePrice)}
        </p>
        <InfoTip term="Prezzo netto" />
      </div>
    </div>
  )
}
