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
import type { ComparisonResult, MethodKind } from '@/domain/financing/types'

const config = {
  cash: { label: METHODS.cash, color: '#2E7D32' },
  loan: { label: METHODS.loan, color: '#0A66C2' },
  balloon: { label: METHODS.balloon, color: '#F2C84B' },
  leasing: { label: METHODS.leasing, color: '#8A8A8A' },
} satisfies ChartConfig

const DASHES: Record<MethodKind, string> = {
  cash: '10 4',
  loan: 'none',
  balloon: '8 4',
  leasing: '2 4',
}

export function OutflowsChart({ result }: { result: ComparisonResult }) {
  const kinds: MethodKind[] = ['cash', 'loan', 'balloon', 'leasing']
  const active = kinds.filter((k) => result[k].valid)

  const monthsOf = (k: MethodKind): number => {
    const m = result[k]
    if (!m.valid || m.kind === 'cash') return 0
    return m.months
  }
  const maxMonths = Math.max(...active.map(monthsOf), 0)

  const data: Record<string, number | undefined>[] = []
  for (let month = 0; month <= maxMonths; month++) {
    const row: Record<string, number | undefined> = { month }
    for (const k of active) {
      const m = result[k]
      if (!m.valid) continue
      if (m.kind === 'cash') {
        row.cash = m.initialCash
        continue
      }
      let v = m.initialCash
      for (let i = 0; i < Math.min(month, m.months); i++) {
        v += m.schedule[i].payment + m.monthlyFee
      }
      if (month === m.months) v += m.finalPayment
      row[k] = v
    }
    data.push(row)
  }

  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold">{CHARTS.chart5.title}</h3>
      <ChartContainer config={config} className="h-[280px] w-full lg:h-[380px]">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" type="number" domain={[0, maxMonths]} tickLine={false} label={CHARTS.monthsAxis} />
          <YAxis tickFormatter={(v: number) => formatMoneyRounded(v)} width={90} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={(l) => `Mese ${l}`} formatter={(value) => formatMoney(Number(value))} />} />
          <ChartLegend content={<ChartLegendContent />} />
          {active.map((k) => (
            <Line
              key={k}
              type="stepAfter"
              dataKey={k}
              stroke={`var(--color-${k})`}
              strokeWidth={2}
              strokeDasharray={DASHES[k]}
              dot={false}
              connectNulls={false}
              animationDuration={300}
            />
          ))}
        </LineChart>
      </ChartContainer>
      <p className="text-sm text-muted-foreground">{CHARTS.chart5.caption}</p>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="data">
          <AccordionTrigger>{CHARTS.showTable}</AccordionTrigger>
          <AccordionContent>
            <div className="max-h-80 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{CHARTS.monthsAxis}</TableHead>
                    {active.map((k) => (
                      <TableHead key={k}>{METHODS[k]}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="tabular-nums">{row.month}</TableCell>
                      {active.map((k) => (
                        <TableCell key={k} className="tabular-nums">
                          {row[k] === undefined ? '—' : formatMoney(row[k] as number)}
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
