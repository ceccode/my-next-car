import { useRef, useState } from 'react'
import { Download, Link, RotateCcw } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BalloonForm } from '@/components/forms/BalloonForm'
import { LeasingForm } from '@/components/forms/LeasingForm'
import { LoanForm } from '@/components/forms/LoanForm'
import { SharedForm } from '@/components/forms/SharedForm'
import { TradeInForm } from '@/components/forms/TradeInForm'
import { VehicleForm } from '@/components/forms/VehicleForm'
import { ComparisonCards } from '@/components/results/ComparisonCards'
import { ComparisonTable } from '@/components/results/ComparisonTable'
import { Explanations } from '@/components/results/Explanations'
import { Glossary } from '@/components/results/Glossary'
import { Verdict } from '@/components/results/Verdict'
import { useSimulation } from '@/hooks/useSimulation'
import { buildCsv, downloadCsv } from '@/lib/csv'
import {
  APP,
  EXCLUDED_COSTS_NOTE,
  EXAMPLE_NOTE,
  HEADER,
  METHODS,
  STEPS,
  TAN_TAEG_ALERT,
  TAN_TAEG_ALERT_TITLE,
} from '@/lib/strings'

function CopyLinkButton({ link }: { link: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef(0)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setStatus('copied')
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('failed')
    }
  }
  if (status === 'failed') {
    return (
      <Input
        readOnly
        value={link}
        aria-label="Link di condivisione"
        onFocus={(e) => e.currentTarget.select()}
      />
    )
  }
  return (
    <Button variant="outline" onClick={onCopy}>
      <Link aria-hidden />
      {status === 'copied' ? HEADER.linkCopied : HEADER.copyLink}
    </Button>
  )
}

export default function App() {
  const sim = useSimulation()
  const { state, result, baseline } = sim

  const onReset = () => {
    if (window.confirm(HEADER.resetConfirm)) sim.resetExample()
  }
  const onExport = () => downloadCsv(buildCsv(state, result), 'my-next-car-confronto.csv')

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-2xl font-semibold">
            {APP.name}{' '}
            <span className="text-sm font-normal text-muted-foreground">{APP.descriptor}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{APP.subtitle}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <CopyLinkButton link={sim.shareLink} />
            <Button variant="outline" onClick={onExport}>
              <Download aria-hidden />
              {HEADER.exportCsv}
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw aria-hidden />
              {HEADER.resetExample}
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl gap-8 px-4 py-8 lg:grid lg:grid-cols-[400px_minmax(0,1fr)]">
        <aside className="mb-8 space-y-8 lg:mb-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:pr-2">
          <section aria-labelledby="step-1" className="space-y-4">
            <h2 id="step-1" className="text-lg font-semibold">
              {STEPS.vehicle}
            </h2>
            <VehicleForm
              state={state}
              netPurchasePrice={result.netPurchasePrice}
              onVehicle={sim.setVehicle}
              onAcquisition={sim.setAcquisition}
            />
          </section>
          <section aria-labelledby="step-2" className="space-y-4">
            <h2 id="step-2" className="text-lg font-semibold">
              {STEPS.tradeIn}
            </h2>
            <TradeInForm state={state} tradeInEquity={result.tradeInEquity} onAcquisition={sim.setAcquisition} />
          </section>
          <section aria-labelledby="step-3" className="space-y-4">
            <h2 id="step-3" className="text-lg font-semibold">
              {STEPS.offers}
            </h2>
            {sim.isExample ? <p className="text-xs text-muted-foreground">{EXAMPLE_NOTE}</p> : null}
            <SharedForm
              state={state}
              netPurchasePrice={result.netPurchasePrice}
              onShared={sim.setShared}
              onApplyToAll={sim.applySharedToAll}
            />
            <Accordion type="single" collapsible defaultValue="loan" className="w-full">
              <AccordionItem value="loan">
                <AccordionTrigger>{METHODS.loan}</AccordionTrigger>
                <AccordionContent>
                  <LoanForm
                    state={state}
                    netPurchasePrice={result.netPurchasePrice}
                    loan={result.loan}
                    onLoan={sim.setLoan}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="balloon">
                <AccordionTrigger>{METHODS.balloon}</AccordionTrigger>
                <AccordionContent>
                  <BalloonForm
                    state={state}
                    netPurchasePrice={result.netPurchasePrice}
                    balloon={result.balloon}
                    onBalloon={sim.setBalloon}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="leasing">
                <AccordionTrigger>{METHODS.leasing}</AccordionTrigger>
                <AccordionContent>
                  <LeasingForm
                    state={state}
                    netPurchasePrice={result.netPurchasePrice}
                    leasing={result.leasing}
                    onLeasing={sim.setLeasing}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </aside>
        <div className="space-y-8">
          <Verdict
            result={result}
            hasBaseline={baseline !== null}
            onSaveScenario={sim.saveScenario}
            onUpdateScenario={sim.updateScenario}
            onRemoveScenario={sim.removeScenario}
          />
          <Alert>
            <AlertDescription>
              <strong>{TAN_TAEG_ALERT_TITLE}</strong> {TAN_TAEG_ALERT}
            </AlertDescription>
          </Alert>
          <ComparisonCards result={result} baselineResult={sim.baselineResult} />
          <Explanations result={result} />
          <ComparisonTable result={result} />
          <p className="text-xs text-muted-foreground">{EXCLUDED_COSTS_NOTE}</p>
          <Glossary />
        </div>
      </main>
    </div>
  )
}
