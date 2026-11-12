import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DebtChart } from '@/components/charts/DebtChart'
import { InterestPrincipalChart } from '@/components/charts/InterestPrincipalChart'
import { OutflowsChart } from '@/components/charts/OutflowsChart'
import { TotalCostChart } from '@/components/charts/TotalCostChart'
import { WhatIfChart } from '@/components/charts/WhatIfChart'
import { WhenYouPayChart } from '@/components/charts/WhenYouPayChart'
import { CHARTS } from '@/lib/strings'
import type { ComparisonResult, SimulationState } from '@/domain/financing/types'

interface ChartsSectionProps {
  state: SimulationState
  result: ComparisonResult
}

export default function ChartsSection({ state, result }: ChartsSectionProps) {
  return (
    <section aria-labelledby="charts-title" className="space-y-3">
      <h2 id="charts-title" className="text-2xl font-semibold">
        {CHARTS.heading}
      </h2>
      <div className="overflow-x-auto">
        <Tabs defaultValue="totalCost">
          <TabsList className="grid h-auto w-full grid-flow-col auto-cols-fr justify-start overflow-x-auto">
            <TabsTrigger value="totalCost">{CHARTS.tabs.totalCost}</TabsTrigger>
            <TabsTrigger value="whenYouPay">{CHARTS.tabs.whenYouPay}</TabsTrigger>
            <TabsTrigger value="debt">{CHARTS.tabs.debt}</TabsTrigger>
            <TabsTrigger value="interestPrincipal">{CHARTS.tabs.interestPrincipal}</TabsTrigger>
            <TabsTrigger value="outflows">{CHARTS.tabs.outflows}</TabsTrigger>
            <TabsTrigger value="whatIf">{CHARTS.tabs.whatIf}</TabsTrigger>
          </TabsList>
          <TabsContent value="totalCost" className="mt-3">
            <TotalCostChart result={result} />
          </TabsContent>
          <TabsContent value="whenYouPay" className="mt-3">
            <WhenYouPayChart result={result} />
          </TabsContent>
          <TabsContent value="debt" className="mt-3">
            <DebtChart result={result} />
          </TabsContent>
          <TabsContent value="interestPrincipal" className="mt-3">
            <InterestPrincipalChart result={result} />
          </TabsContent>
          <TabsContent value="outflows" className="mt-3">
            <OutflowsChart result={result} />
          </TabsContent>
          <TabsContent value="whatIf" className="mt-3">
            <WhatIfChart state={state} result={result} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
