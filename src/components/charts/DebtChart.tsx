import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatMoney, formatMoneyRounded } from '@/lib/format'
import { CHARTS, METHODS } from '@/lib/strings'
import type { ComparisonResult, FinancedKind, FinancedResult } from '@/domain/financing/types'

const config = {
  loan: { label: METHODS.loan, color: '#0A66C2' },
  balloon: { label: METHODS.balloon, color: '#F2C84B' },
  leasing: { label: METHODS.leasing, color: '#8A8A8A' },
} satisfies ChartConfig

const DASHES: Record<FinancedKind, string> = {
  loan: 'none',
  balloon: '8 4',
  leasing: '2 4',
}

export function DebtChart({ result }: { result: ComparisonResult }) {
  const active: { kind: FinancedKind; m: FinancedResult }[] = []
  for (const kind of ['loan', 'balloon', 'leasing'] as const) {
    const m = result[kind]
    if (m.valid) active.push({ kind, m })
  }

  const maxMonths = active.reduce((max, { m }) => Math.max(max, m.months), 0)
  const data: { month: number; loan?: number; balloon?: number; leasing?: number }[] = []
  for (let month = 0; month <= maxMonths; month++) {
    const row: { month: number; loan?: number; balloon?: number; leasing?: number } = { month }
    for (const { kind, m } of active) {
      if (month === 0) row[kind] = m.principal
      else if (month <= m.months) row[kind] = m.schedule[month - 1].balance
    }
    data.push(row)
  }

  const leasingQuoted = result.leasing.valid && result.leasing.kind === 'leasing' && result.leasing.nominalRateIsEstimated

  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold">{CHARTS.chart3.title}</h3>
      <ChartContainer config={config} className="h-[280px] w-full lg:h-[380px]">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" type="number" domain={[0, maxMonths]} tickLine={false} label={CHARTS.monthsAxis} />
          <YAxis tickFormatter={(v: number) => formatMoneyRounded(v)} width={90} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={(l) => `Mese ${l}`} formatter={(value) => formatMoney(Number(value))} />} />
          <ChartLegend content={<ChartLegendContent />} />
          {active.map(({ kind }) => (
            <Line
              key={kind}
              type="monotone"
              dataKey={kind}
              stroke={`var(--color-${kind})`}
              strokeWidth={2}
              strokeDasharray={DASHES[kind]}
              dot={false}
              connectNulls={false}
              animationDuration={300}
            />
          ))}
        </LineChart>
      </ChartContainer>
      <p className="text-sm text-muted-foreground">{CHARTS.chart3.caption}</p>
      {leasingQuoted ? <p className="text-sm text-muted-foreground">{CHARTS.chart3.quotedNote}</p> : null}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="data">
          <AccordionTrigger>{CHARTS.showTable}</AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{CHARTS.monthsAxis}</TableHead>
                    {active.map(({ kind }) => (
                      <TableHead key={kind}>{METHODS[kind]}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="tabular-nums">{row.month}</TableCell>
                      {active.map(({ kind }) => (
                        <TableCell key={kind} className="tabular-nums">
                          {row[kind] === undefined ? '—' : formatMoney(row[kind] as number)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
