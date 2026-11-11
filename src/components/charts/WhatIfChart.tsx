import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig as ChartConfigType,
} from '@/components/ui/chart'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { computeSensitivity, currentParameterValue, type SensitivityMetric, type SensitivityParameter } from '@/domain/financing/sensitivity'
import { formatMoney, formatMoneyRounded, formatPercent } from '@/lib/format'
import { CHARTS, METHODS } from '@/lib/strings'
import type { ComparisonResult, FinancedKind, SimulationState } from '@/domain/financing/types'

const config = {
  metric: { label: '', color: '#0A66C2' },
} satisfies ChartConfigType

interface WhatIfChartProps {
  state: SimulationState
  result: ComparisonResult
}

export function WhatIfChart({ state, result }: WhatIfChartProps) {
  const [method, setMethod] = useState<FinancedKind>('loan')
  const [parameter, setParameter] = useState<SensitivityParameter>('tan')
  const [metric, setMetric] = useState<SensitivityMetric>('monthlyOutflow')

  const methodValid = result[method].valid
  const leasingQuotedMode = state.leasing.mode === 'quoted'

  const effectiveParameter: SensitivityParameter =
    method === 'loan' && parameter === 'finalPayment' ? 'downPayment' : parameter

  const points = useMemo(
    () => (methodValid && !(method === 'leasing' && leasingQuotedMode) ? computeSensitivity(state, method, effectiveParameter) : []),
    [state, method, effectiveParameter, methodValid, leasingQuotedMode],
  )

  const chartData = points.map((p) => ({ value: p.value, metric: p[metric] }))
  const currentValue = currentParameterValue(state, method, effectiveParameter)

  const formatValue = (v: number): string => {
    if (effectiveParameter === 'tan') return formatPercent(v)
    if (effectiveParameter === 'months') return `${v} ${CHARTS.chart6.monthsUnit}`
    return formatMoneyRounded(v * 100)
  }

  if (method === 'leasing' && leasingQuotedMode) {
    return (
      <div className="space-y-2">
        <h3 className="text-base font-semibold">{CHARTS.tabs.whatIf}</h3>
        <p className="text-sm text-muted-foreground">{CHARTS.chart6.quotedModeNote}</p>
      </div>
    )
  }

  if (!methodValid) {
    return (
      <div className="space-y-2">
        <h3 className="text-base font-semibold">{CHARTS.tabs.whatIf}</h3>
        <p className="text-sm text-muted-foreground">{CHARTS.chart6.noData}</p>
      </div>
    )
  }

  const first = points[0]
  const last = points[points.length - 1]
  const sentence =
    first && last
      ? CHARTS.chart6.sentence(
          formatValue(first.value),
          formatValue(last.value),
          CHARTS.chart6.metrics[metric],
          formatMoney(first[metric]),
          formatMoney(last[metric]),
        )
      : null

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">{CHARTS.tabs.whatIf}</h3>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">{CHARTS.chart6.method}</p>
        <Tabs value={method} onValueChange={(v) => setMethod(v as FinancedKind)}>
          <TabsList className="grid auto-cols-fr w-full grid-flow-col">
            {(['loan', 'balloon', 'leasing'] as const).map((k) => (
              <TabsTrigger key={k} value={k}>
                {METHODS[k]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <p className="text-xs text-muted-foreground">{CHARTS.chart6.parameter}</p>
        <Tabs value={effectiveParameter} onValueChange={(v) => setParameter(v as SensitivityParameter)}>
          <TabsList className="grid auto-cols-fr w-full grid-flow-col">
            <TabsTrigger value="tan">{CHARTS.chart6.params.tan}</TabsTrigger>
            <TabsTrigger value="months">{CHARTS.chart6.params.months}</TabsTrigger>
            <TabsTrigger value="downPayment">{CHARTS.chart6.params.downPayment}</TabsTrigger>
            {method !== 'loan' ? (
              <TabsTrigger value="finalPayment">{CHARTS.chart6.params.finalPayment}</TabsTrigger>
            ) : null}
          </TabsList>
        </Tabs>
        <p className="text-xs text-muted-foreground">{CHARTS.chart6.metric}</p>
        <Tabs value={metric} onValueChange={(v) => setMetric(v as SensitivityMetric)}>
          <TabsList className="grid auto-cols-fr w-full grid-flow-col">
            <TabsTrigger value="monthlyOutflow">{CHARTS.chart6.metrics.monthlyOutflow}</TabsTrigger>
            <TabsTrigger value="totalInterest">{CHARTS.chart6.metrics.totalInterest}</TabsTrigger>
            <TabsTrigger value="totalEconomicCost">{CHARTS.chart6.metrics.totalEconomicCost}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ChartContainer config={config} className="h-[280px] w-full lg:h-[380px]">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="value"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatValue}
            tickLine={false}
          />
          <YAxis tickFormatter={(v: number) => formatMoneyRounded(v)} width={90} tickLine={false} />
          <ChartTooltip
            labelFormatter={(l) => formatValue(Number(l))}
            content={<ChartTooltipContent formatter={(value) => formatMoney(Number(value))} />}
          />
          <ReferenceLine x={currentValue} label={CHARTS.chart6.today} />
          <Line
            dataKey="metric"
            stroke="var(--color-metric)"
            strokeWidth={2}
            dot={{ r: 3 }}
            animationDuration={300}
          />
        </LineChart>
      </ChartContainer>
      {sentence ? <p className="text-sm text-muted-foreground">{sentence}</p> : null}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="data">
          <AccordionTrigger>{CHARTS.showTable}</AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{CHARTS.chart6.tableColumns.value}</TableHead>
                    <TableHead>{CHARTS.chart6.tableColumns.monthlyOutflow}</TableHead>
                    <TableHead>{CHARTS.chart6.tableColumns.totalInterest}</TableHead>
                    <TableHead>{CHARTS.chart6.tableColumns.totalEconomicCost}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {points.map((p) => (
                    <TableRow key={p.value}>
                      <TableCell className="tabular-nums">{formatValue(p.value)}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(p.monthlyOutflow)}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(p.totalInterest)}</TableCell>
                      <TableCell className="tabular-nums">{formatMoney(p.totalEconomicCost)}</TableCell>
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
