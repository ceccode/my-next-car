import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { GLOSSARY, GLOSSARY_TITLE } from '@/lib/strings'

export function Glossary() {
  return (
    <section aria-labelledby="glossary-title" className="space-y-3">
      <h2 id="glossary-title" className="text-2xl font-semibold">
        {GLOSSARY_TITLE}
      </h2>
      <Accordion type="multiple" className="w-full">
        {GLOSSARY.map((entry, i) => (
          <AccordionItem key={entry.term} value={`glossary-${i}`}>
            <AccordionTrigger className="text-sm">{entry.term}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">{entry.definition}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
