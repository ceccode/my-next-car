import { useMemo, useState } from 'react'
import { CarFront, Ellipsis } from 'lucide-react'
import { AdjustmentsSheet } from '@/components/AdjustmentsSheet'
import { CostRanking } from '@/components/CostRanking'
import { MenuSheet } from '@/components/MenuSheet'
import { MethodSheet } from '@/components/MethodSheet'
import { PriceCard } from '@/components/PriceCard'
import { QuoteCard } from '@/components/QuoteCard'
import { QuoteSheet } from '@/components/QuoteSheet'
import { TermsPanel } from '@/components/TermsPanel'
import { starterScenario } from '@/data/starterScenario'
import type { MethodKind } from '@/domain/financing/types'
import { countAdjustments, maxDownPayment } from '@/domain/scenario/scenario'
import { useSimulation } from '@/hooks/useSimulation'
import { APP, NOTES } from '@/lib/strings'

type OpenSheet = { name: 'none' } | { name: 'menu' } | { name: 'adjustments' } | { name: 'quote' } | { name: 'method'; kind: MethodKind }

export default function App() {
  const simulation = useSimulation()
  const { state, result } = simulation
  const [sheet, setSheet] = useState<OpenSheet>({ name: 'none' })
  const closeSheet = () => setSheet({ name: 'none' })
  const isExample = useMemo(() => JSON.stringify(state) === JSON.stringify(starterScenario), [state])

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-1.5 sm:px-6 sm:pt-6">
        <p className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-full bg-surface">
            <CarFront className="size-5" aria-hidden />
          </span>
          {APP.name}
        </p>
        <button type="button" onClick={() => setSheet({ name: 'menu' })} className="icon-button" aria-label={APP.menu}>
          <Ellipsis className="size-5" aria-hidden />
        </button>
      </header>

      <main className="mx-auto grid max-w-5xl gap-4 px-4 pb-60 sm:px-6 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-6 md:pb-12">
        <h1 className="sr-only">{APP.heading}</h1>

        <div className="md:sticky md:top-6 md:space-y-4 md:self-start">
          <PriceCard
            listPrice={state.acquisition.listPrice}
            netPurchasePrice={result.netPurchasePrice}
            adjustments={countAdjustments(state)}
            isExample={isExample}
            onListPriceChange={simulation.setListPrice}
            onOpenAdjustments={() => setSheet({ name: 'adjustments' })}
          />
          <TermsPanel terms={state.shared} maxDownPayment={maxDownPayment(result)} onChange={simulation.setCommonTerms} />
        </div>

        <div className="space-y-4">
          <CostRanking result={result} onOpen={(kind) => setSheet({ name: 'method', kind })} />
          <QuoteCard onOpen={() => setSheet({ name: 'quote' })} />
          <p className="px-2 text-sm text-ink-soft">
            {isExample ? `${NOTES.example} ` : ''}
            {NOTES.excludedCosts}
          </p>
        </div>
      </main>

      <MethodSheet kind={sheet.name === 'method' ? sheet.kind : null} simulation={simulation} onClose={closeSheet} />
      <QuoteSheet open={sheet.name === 'quote'} onClose={closeSheet} onPick={(kind) => setSheet({ name: 'method', kind })} />
      <AdjustmentsSheet open={sheet.name === 'adjustments'} onClose={closeSheet} simulation={simulation} />
      <MenuSheet open={sheet.name === 'menu'} onClose={closeSheet} simulation={simulation} />
    </div>
  )
}
