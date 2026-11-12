import { ChevronRight, FileText } from 'lucide-react'
import { QUOTE } from '@/lib/strings'

/** The way in for people who already hold a dealer quote. */
export function QuoteCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="card group flex min-h-16 w-full items-center gap-4 px-5 text-left hover:bg-surface sm:px-6">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface">
        <FileText className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 py-3">
        <span className="block font-semibold">{QUOTE.title}</span>
        <span className="flex items-center gap-1 font-semibold text-action-ink">
          {QUOTE.action}
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </span>
    </button>
  )
}
