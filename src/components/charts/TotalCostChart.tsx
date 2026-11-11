import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
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
  net: { label: CHARTS.chart1.netPrice, color: '#0A66C2' },
  interest: { label: CHARTS.chart1.interest, color: '#F2C84B' },
  fees: { label: CHARTS.chart1.fees, color: '#8A8A8A' },
} satisfies ChartConfig

export function TotalCostChart({ result }: { result: ComparisonResult }) {
  const kinds: MethodKind[] = ['cash', 'loan', 'balloon', 'leasing']
  const data = kinds.flatMap((k) => {
    const m = result[k]
    if (!m.valid) return []
    return [
      {
        method: METHODS[k],
        net: result.netPurchasePrice,
        interest: m.totalInterest,
        fees: m.totalFees,
        total: m.totalEconomicCost,
      },
    ]
  })

  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold">{CHARTS.chart1.title}</h3>
      <ChartContainer config={config} className="h-[280px] w-full lg:h-[380px]">
        <BarChart data={data} margin={{ top: 24, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="method" tickLine={false} />
          <YAxis tickFormatter={(v: number) => formatMoneyRounded(v)} width={90} tickLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatMoney(Number(value))} />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="net" stackId="a" fill="var(--color-net)" animationDuration={300} />
          <Bar dataKey="interest" stackId="a" fill="var(--color-interest)" animationDuration={300} />
          <Bar dataKey="fees" stackId="a" fill="var(--color-fees)" animationDuration={300} radius={[4, 4, 0, 0]}>
            <LabelList dataKey="total" position="top" formatter={(v) => formatMoneyRounded(Number(v))} />
          </Bar>
        </BarChart>
      </ChartContainer>
      <p className="text-sm text-muted-foreground">{CHARTS.chart1.caption}</p>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="data">
          <AccordionTrigger>{CHARTS.showTable}</AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metodo</TableHead>
                    <TableHead>{CHARTS.chart1.netPrice}</TableHead>
                    <TableHead>{CHARTS.chart1.interest}</TableHead>
                    <TableHead>{CHARTS.chart1.fees}</TableHead>
                    <TableHead>{CHARTS.tabs.totalCost}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((d) => (
                    <TableRow key={d.method}>
                      <TableCell>{d.method}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(d.net)}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(d.interest)}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(d.fees)}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(d.total)}</TableCell>
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
