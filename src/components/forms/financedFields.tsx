import { SliderField } from '@/components/common/SliderField'
import { MoneyField } from '@/components/common/MoneyField'
import { MESSAGES } from '@/domain/financing/validation'
import { FINANCING_FIELDS, SHARED } from '@/lib/strings'
import type { Cents, FinancedResult, MethodInvalid } from '@/domain/financing/types'

export type MethodResult = FinancedResult | MethodInvalid

export const methodErrors = (m: MethodResult): string[] => (m.valid ? [] : m.errors)
export const fieldError = (errors: string[], msg: string): string | null =>
  errors.includes(msg) ? msg : null

export interface MethodFields {
  downPayment: number
  months: number
  tanPercent: number
  upfrontFees: number
  monthlyFee: number
  quotedTaegPercent: number
}

interface BaseFinancedFieldsProps {
  prefix: string
  fields: MethodFields
  netPurchasePrice: Cents
  errors: string[]
  downPaymentLabel: string
  showTan: boolean
  onChange: (patch: Partial<MethodFields>) => void
}

export function BaseFinancedFields({
  prefix,
  fields,
  netPurchasePrice,
  errors,
  downPaymentLabel,
  showTan,
  onChange,
}: BaseFinancedFieldsProps) {
  const maxAmount = Math.max(0, Math.floor(netPurchasePrice / 100))
  return (
    <>
      <SliderField
        id={`${prefix}-down-payment`}
        label={downPaymentLabel}
        infoTerm="Anticipo"
        value={fields.downPayment}
        min={0}
        max={maxAmount}
        step={500}
        onChange={(value) => onChange({ downPayment: value })}
      />
      <SliderField
        id={`${prefix}-months`}
        label={SHARED.months}
        value={fields.months}
        min={6}
        max={120}
        step={6}
        integer
        error={fieldError(errors, MESSAGES.months)}
        onChange={(value) => onChange({ months: value })}
      />
      {showTan ? (
        <SliderField
          id={`${prefix}-tan`}
          label={SHARED.tanPercent}
          infoTerm="TAN (Tasso Annuo Nominale)"
          value={fields.tanPercent}
          min={0}
          max={15}
          step={0.05}
          error={fieldError(errors, MESSAGES.tan)}
          onChange={(value) => onChange({ tanPercent: value })}
        />
      ) : null}
      <MoneyField
        id={`${prefix}-upfront`}
        label={SHARED.upfrontFees}
        infoTerm="Spese iniziali"
        value={fields.upfrontFees}
        min={0}
        onChange={(value) => onChange({ upfrontFees: value })}
      />
      <MoneyField
        id={`${prefix}-monthly-fee`}
        label={SHARED.monthlyFee}
        infoTerm="Spese mensili"
        value={fields.monthlyFee}
        min={0}
        onChange={(value) => onChange({ monthlyFee: value })}
      />
      <MoneyField
        id={`${prefix}-quoted-taeg`}
        label={FINANCING_FIELDS.quotedTaegPercent}
        infoTerm="TAEG (Tasso Annuo Effettivo Globale)"
        value={fields.quotedTaegPercent}
        min={0}
        max={40}
        step={0.01}
        onChange={(value) => onChange({ quotedTaegPercent: value })}
      />
    </>
  )
}
