import { SHARED } from '@/lib/strings'
import type { SimulationState } from '@/domain/financing/types'
import { BaseFinancedFields, methodErrors, type MethodResult } from './financedFields'

interface LoanFormProps {
  state: SimulationState
  netPurchasePrice: number
  loan: MethodResult
  onLoan: (patch: Partial<SimulationState['loan']>) => void
}

export function LoanForm({ state, netPurchasePrice, loan, onLoan }: LoanFormProps) {
  const errors = methodErrors(loan)
  const l = state.loan
  return (
    <div className="space-y-4">
      <BaseFinancedFields
        prefix="loan"
        fields={{
          downPayment: l.downPayment,
          months: l.months,
          tanPercent: l.tanPercent,
          upfrontFees: l.upfrontFees,
          monthlyFee: l.monthlyFee,
          quotedTaegPercent: l.quotedTaegPercent,
        }}
        netPurchasePrice={netPurchasePrice}
        errors={errors}
        downPaymentLabel={SHARED.downPayment}
        showTan
        onChange={(patch) => onLoan(patch)}
      />
      {!loan.valid ? (
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
