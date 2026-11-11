import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { TooltipContentProps } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatMoney } from '@/lib/format'
import { CHARTS, METHODS } from '@/lib/strings'
import type { ComparisonResult, FinancedKind } from '@/domain/financing/types'

const config = {
  principal: { label: CHARTS.chart4.principal, color: '#0A66C2' },
  interest: { label: CHARTS.chart4.interest, color: '#F2C84B' },
} satisfies ChartConfig

interface ScheduleData {
  month: number
  principal: number
  interest: number
  payment: number
  balance: number
}

export function InterestPrincipalChart({ result }: { result: ComparisonResult }) {
  const kinds: FinancedKind[] = ['loan', 'balloon', 'leasing']
  const validKinds = kinds.filter((k) => result[k].valid)
  const [selected, setSelected] = useState<FinancedKind>(validKinds[0] ?? 'loan')
  const activeKind = validKinds.includes(selected) ? selected : (validKinds[0] as FinancedKind)

  if (validKinds.length === 0) return null

  const m = result[activeKind]
  if (!m.valid) return null

  const data: ScheduleData[] = m.schedule.map((r) => ({
    month: r.month,
    principal: r.principal,
    interest: r.interest,
    payment: r.payment,
    balance: r.balance,
  }))

  const renderTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload || payload.length === 0) return null
    const row = payload[0]?.payload as ScheduleData | undefined
    if (!row) return null
    return (
      <div className="grid w-44 gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
        <span className="font-medium">Mese {row.month}</span>
        <span className="flex justify-between">
          <span className="text-muted-foreground">{CHARTS.chart4.payment}</span>
          <span className="tabular-nums">{formatMoney(row.payment)}</span>
        </span>
        <span className="flex justify-between">
          <span className="text-muted-foreground">{CHARTS.chart4.principalCol}</span>
          <span className="tabular-nums">{formatMoney(row.principal)}</span>
        </span>
        <span className="flex justify-between">
          <span className="text-muted-foreground">{CHARTS.chart4.interestCol}</span>
          <span className="tabular-nums">{formatMoney(row.interest)}</span>
        </span>
        <span className="flex justify-between">
          <span className="text-muted-foreground">{CHARTS.chart4.balanceCol}</span>
          <span className="tabular-nums">{formatMoney(row.balance)}</span>
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold">{CHARTS.chart4.title}</h3>
      <Tabs value={activeKind} onValueChange={(v) => setSelected(v as FinancedKind)}>
        <TabsList className="grid auto-cols-fr w-full grid-flow-col">
          {validKinds.map((k) => (
            <TabsTrigger key={k} value={k}>
              {METHODS[k]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <ChartContainer config={config} className="h-[280px] w-full lg:h-[380px]">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" type="number" domain={[0, m.months]} tickLine={false} />
          <YAxis tickFormatter={(v: number) => formatMoney(v)} width={90} tickLine={false} />
          <ChartTooltip cursor={false} content={renderTooltip} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="principal" stackId="s" fill="var(--color-principal)" animationDuration={300} />
          <Bar dataKey="interest" stackId="s" fill="var(--color-interest)" animationDuration={300} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
      {m.finalPayment > 0 ? (
        <p className="text-sm text-muted-foreground">
          {CHARTS.chart4.finalPaymentCaption(m.months, formatMoney(m.finalPayment))}
        </p>
      ) : null}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="data">
          <AccordionTrigger>{CHARTS.showTable}</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2 flex items-center gap-1 text-sm font-medium">
              {CHARTS.amortizationTitle}
            </p>
            <div className="max-h-80 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{CHARTS.chart4.month}</TableHead>
                    <TableHead>{CHARTS.chart4.payment}</TableHead>
                    <TableHead>{CHARTS.chart4.principalCol}</TableHead>
                    <TableHead>{CHARTS.chart4.interestCol}</TableHead>
                    <TableHead>{CHARTS.chart4.balanceCol}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="tabular-nums">{row.month}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(row.payment)}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(row.principal)}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(row.interest)}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(row.balance)}</TableCell>
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
