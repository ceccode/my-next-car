import { InfoTip } from '@/components/common/InfoTip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatMoney, formatPercent } from '@/lib/format'
import { CARDS, METHODS, TABLE } from '@/lib/strings'
import type { ComparisonResult, FinancedResult, MethodKind } from '@/domain/financing/types'

const KINDS: MethodKind[] = ['cash', 'loan', 'balloon', 'leasing']

function LabelCell({ label, infoTerm }: { label: string; infoTerm?: string }) {
  return (
    <TableHead className="whitespace-nowrap text-left font-medium">
      <span className="inline-flex items-center gap-1">
        {label}
        {infoTerm ? <InfoTip term={infoTerm} /> : null}
      </span>
    </TableHead>
  )
}

export function ComparisonTable({ result }: { result: ComparisonResult }) {
  if (result.globalErrors.length > 0) return null

  const valid = (kind: MethodKind) => result[kind].valid
  const num = (kind: MethodKind, key: string, format: (v: number) => string): string => {
    const m = result[kind]
    if (!m.valid) return TABLE.dash
    const v = (m as unknown as Record<string, unknown>)[key]
    if (v === null) return CARDS.nd
    return format(v as number)
  }

  const ownerDuring = (kind: MethodKind): string => {
    if (!valid(kind)) return TABLE.dash
    return kind === 'leasing' ? TABLE.leasingCompany : TABLE.you
  }
  const ownerEnd = (kind: MethodKind): string => {
    if (!valid(kind)) return TABLE.dash
    if (kind === 'cash') return TABLE.you
    if (kind === 'loan') return TABLE.you
    if (kind === 'balloon') return TABLE.youAfterBalloon
    return TABLE.youAfterBuyout
  }
  const returnOption = (kind: MethodKind): string => {
    if (kind === 'cash' || kind === 'loan') {
      return valid(kind) ? TABLE.notProvided : TABLE.dash
    }
    const m = result[kind]
    if (!m.valid) return TABLE.dash
    return m.returnOptionEnabled ? TABLE.returnYes : TABLE.returnNo
  }

  const rows: { label: string; infoTerm?: string; cells: [string, string, string, string] }[] = [
    {
      label: TABLE.rows.initialCash,
      infoTerm: 'Anticipo',
      cells: KINDS.map((k) => num(k, 'initialCash', formatMoney)) as [string, string, string, string],
    },
    {
      label: TABLE.rows.monthlyOutflow,
      infoTerm: 'Rata',
      cells: [TABLE.dash, num('loan', 'monthlyOutflow', formatMoney), num('balloon', 'monthlyOutflow', formatMoney), num('leasing', 'monthlyOutflow', formatMoney)],
    },
    {
      label: TABLE.rows.months,
      infoTerm: 'Rata',
      cells: [
        TABLE.dash,
        valid('loan') ? String((result.loan as FinancedResult).months) : TABLE.dash,
        valid('balloon') ? String((result.balloon as FinancedResult).months) : TABLE.dash,
        valid('leasing') ? String((result.leasing as FinancedResult).months) : TABLE.dash,
      ],
    },
    {
      label: TABLE.rows.finalPayment,
      infoTerm: 'Maxirata',
      cells: [
        TABLE.dash,
        TABLE.dash,
        num('balloon', 'finalPayment', formatMoney),
        num('leasing', 'finalPayment', formatMoney),
      ],
    },
    {
      label: TABLE.rows.totalInterest,
      infoTerm: 'Interessi totali',
      cells: KINDS.map((k) => num(k, 'totalInterest', formatMoney)) as [string, string, string, string],
    },
    {
      label: TABLE.rows.fees,
      infoTerm: 'Spese iniziali',
      cells: KINDS.map((k) => num(k, 'totalFees', formatMoney)) as [string, string, string, string],
    },
    {
      label: TABLE.rows.tan,
      infoTerm: 'TAN (Tasso Annuo Nominale)',
      cells: [
        TABLE.dash,
        num('loan', 'nominalRatePercent', formatPercent),
        num('balloon', 'nominalRatePercent', formatPercent),
        num('leasing', 'nominalRatePercent', formatPercent),
      ],
    },
    {
      label: TABLE.rows.estimatedTaeg,
      infoTerm: 'TAEG stimato',
      cells: [
        TABLE.dash,
        num('loan', 'estimatedTaegPercent', formatPercent),
        num('balloon', 'estimatedTaegPercent', formatPercent),
        num('leasing', 'estimatedTaegPercent', formatPercent),
      ],
    },
    {
      label: TABLE.rows.totalCashPaid,
      infoTerm: 'Esborso totale',
      cells: KINDS.map((k) => num(k, 'totalCashPaid', formatMoney)) as [string, string, string, string],
    },
    {
      label: TABLE.rows.totalCost,
      infoTerm: 'Costo totale',
      cells: KINDS.map((k) => num(k, 'totalEconomicCost', formatMoney)) as [string, string, string, string],
    },
    {
      label: TABLE.rows.ownerDuring,
      infoTerm: 'Leasing finanziario',
      cells: [ownerDuring('cash'), ownerDuring('loan'), ownerDuring('balloon'), ownerDuring('leasing')],
    },
    {
      label: TABLE.rows.ownerEnd,
      infoTerm: 'Riscatto',
      cells: [ownerEnd('cash'), ownerEnd('loan'), ownerEnd('balloon'), ownerEnd('leasing')],
    },
    {
      label: TABLE.rows.returnOption,
      infoTerm: 'Leasing finanziario',
      cells: [returnOption('cash'), returnOption('loan'), returnOption('balloon'), returnOption('leasing')],
    },
  ]

  return (
    <section aria-labelledby="table-title">
      <h2 id="table-title" className="mb-3 text-2xl font-semibold">
        {TABLE.title}
      </h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left" aria-label="Voce" />
              {KINDS.map((k) => (
                <TableHead key={k}>{METHODS[k]}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <LabelCell label={row.label} infoTerm={row.infoTerm} />
                {row.cells.map((c, i) => (
                  <TableCell key={i} className="whitespace-nowrap tabular-nums">
                    {c}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
