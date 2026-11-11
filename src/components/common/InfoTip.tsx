import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { GLOSSARY, INFO_ARIA } from '@/lib/strings'

export function InfoTip({ term }: { term: string }) {
  const entry = GLOSSARY.find((g) => g.term === term)
  if (!entry) return null
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
          aria-label={INFO_ARIA(term)}
        >
          <Info className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <p className="text-sm font-medium">{term}</p>
        <p className="mt-1 text-sm text-muted-foreground">{entry.definition}</p>
      </PopoverContent>
    </Popover>
  )
}
