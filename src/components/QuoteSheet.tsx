import { ChevronRight } from 'lucide-react'
import { Sheet } from '@/components/Sheet'
import type { FinancedKind } from '@/domain/financing/types'
import { METHOD, QUOTE } from '@/lib/strings'

const FINANCED: FinancedKind[] = ['loan', 'balloon', 'leasing']

interface QuoteSheetProps {
  open: boolean
  onClose: () => void
  onPick: (kind: FinancedKind) => void
}

export function QuoteSheet({ open, onClose, onPick }: QuoteSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title={QUOTE.pickTitle} description={QUOTE.pickDescription}>
      <ul className="space-y-2.5 pb-2">
        {FINANCED.map((kind) => (
          <li key={kind}>
            <button type="button" onClick={() => onPick(kind)} className="card group flex min-h-16 w-full items-center gap-4 rounded-2xl px-4 text-left hover:bg-surface">
              <span className="min-w-0 flex-1 py-3">
                <span className="block font-semibold">{METHOD[kind].name}</span>
                <span className="block text-sm text-ink-soft">{METHOD[kind].tagline}</span>
              </span>
              <ChevronRight className="size-5 text-ink-soft transition-transform group-hover:translate-x-0.5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
