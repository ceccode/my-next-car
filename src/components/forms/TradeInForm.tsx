import { MoneyField } from '@/components/common/MoneyField'
import { InfoTip } from '@/components/common/InfoTip'
import { formatMoney } from '@/lib/format'
import { TRADE_IN } from '@/lib/strings'
import type { Cents, SimulationState } from '@/domain/financing/types'

interface TradeInFormProps {
  state: SimulationState
  tradeInEquity: Cents
  onAcquisition: (patch: Partial<SimulationState['acquisition']>) => void
}

export function TradeInForm({ state, tradeInEquity, onAcquisition }: TradeInFormProps) {
  const a = state.acquisition
  return (
    <div className="space-y-4">
      <MoneyField
        id="trade-in-value"
        label={TRADE_IN.value}
        value={a.tradeInValue}
        min={0}
        onChange={(value) => onAcquisition({ tradeInValue: value })}
      />
      <MoneyField
        id="trade-in-loan"
        label={TRADE_IN.outstandingLoan}
        value={a.tradeInOutstandingLoan}
        min={0}
        onChange={(value) => onAcquisition({ tradeInOutstandingLoan: value })}
      />
      <div className="space-y-1 border-t pt-3">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium tabular-nums">
            {TRADE_IN.netValue} {formatMoney(tradeInEquity)}
          </p>
          <InfoTip term="Valore netto della permuta" />
        </div>
        {tradeInEquity > 0 ? (
          <p className="text-xs text-muted-foreground">{TRADE_IN.positiveNote(formatMoney(tradeInEquity))}</p>
        ) : null}
        {tradeInEquity < 0 ? (
          <p className="text-xs text-muted-foreground">{TRADE_IN.negativeNote(formatMoney(-tradeInEquity))}</p>
        ) : null}
      </div>
    </div>
  )
}
