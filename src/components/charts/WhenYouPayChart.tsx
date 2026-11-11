import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
  signing: { label: CHARTS.chart2.signing, color: '#0A66C2' },
  monthly: { label: CHARTS.chart2.monthly, color: '#F2C84B' },
  final: { label: CHARTS.chart2.finalPayment, color: '#8A8A8A' },
} satisfies ChartConfig

export function WhenYouPayChart({ result }: { result: ComparisonResult }) {
  const kinds: MethodKind[] = ['cash', 'loan', 'balloon', 'leasing']
  const data = kinds.flatMap((k) => {
    const m = result[k]
    if (!m.valid) return []
    if (m.kind === 'cash') {
      return [{ method: METHODS.cash, signing: Math.max(m.initialCash, 0), monthly: 0, final: 0 }]
    }
    return [
      {
        method: METHODS[k],
        signing: Math.max(m.initialCash, 0),
        monthly: m.totalInstallments + m.months * m.monthlyFee,
        final: m.finalPayment,
      },
    ]
  })

  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold">{CHARTS.chart2.title}</h3>
      <ChartContainer config={config} className="h-[280px] w-full lg:h-[380px]">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="method" tickLine={false} />
          <YAxis tickFormatter={(v: number) => formatMoneyRounded(v)} width={90} tickLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatMoney(Number(value))} />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="signing" stackId="a" fill="var(--color-signing)" animationDuration={300} />
          <Bar dataKey="monthly" stackId="a" fill="var(--color-monthly)" animationDuration={300} />
          <Bar dataKey="final" stackId="a" fill="var(--color-final)" animationDuration={300} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
      <p className="text-sm text-muted-foreground">{CHARTS.chart2.caption}</p>
      {result.tradeInEquity !== 0 ? (
        <p className="text-sm text-muted-foreground">{CHARTS.chart2.tradeInNote}</p>
      ) : null}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="data">
          <AccordionTrigger>{CHARTS.showTable}</AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metodo</TableHead>
                    <TableHead>{CHARTS.chart2.signing}</TableHead>
                    <TableHead>{CHARTS.chart2.monthly}</TableHead>
                    <TableHead>{CHARTS.chart2.finalPayment}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((d) => (
                    <TableRow key={d.method}>
                      <TableCell>{d.method}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(d.signing)}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(d.monthly)}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(d.final)}</TableCell>
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
