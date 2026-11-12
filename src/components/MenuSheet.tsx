import { useState, type ReactNode } from 'react'
import { Download, Link2, RotateCcw, Share2 } from 'lucide-react'
import { Sheet } from '@/components/Sheet'
import type { Simulation } from '@/hooks/useSimulation'
import { buildCsv, downloadCsv } from '@/lib/csv'
import { APP, DETAIL, MENU, NOTES } from '@/lib/strings'

interface MenuSheetProps {
  open: boolean
  onClose: () => void
  simulation: Simulation
}

type CopyState = 'idle' | 'copied' | 'failed'

export function MenuSheet({ open, onClose, simulation }: MenuSheetProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const canShareNatively = typeof navigator.share === 'function'

  const share = async () => {
    if (canShareNatively) {
      try {
        await navigator.share({ title: APP.name, url: simulation.shareLink })
        return
      } catch {
        // Dismissed or refused: fall back to copying the link.
      }
    }
    try {
      await navigator.clipboard.writeText(simulation.shareLink)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  const reset = () => {
    if (!window.confirm(MENU.resetConfirm)) return
    simulation.reset()
    onClose()
  }

  const close = () => {
    setCopyState('idle')
    onClose()
  }

  return (
    <Sheet open={open} onClose={close} title={APP.name} description={APP.description}>
      <div className="space-y-2.5">
        <Action icon={canShareNatively ? <Share2 /> : <Link2 />} label={copyState === 'copied' ? MENU.linkCopied : MENU.share} onClick={share} />
        {copyState === 'failed' ? (
          <input
            readOnly
            aria-label={MENU.shareLink}
            value={simulation.shareLink}
            onFocus={(event) => event.currentTarget.select()}
            className="w-full rounded-2xl border border-line bg-card px-4 py-3"
          />
        ) : null}
        <Action
          icon={<Download />}
          label={MENU.exportCsv}
          onClick={() => downloadCsv(buildCsv(simulation.state, simulation.result), MENU.csvFileName)}
        />
        <Action icon={<RotateCcw />} label={MENU.reset} onClick={reset} />
      </div>
      <div className="mt-6 space-y-3 pb-2 text-sm text-ink-soft">
        <p>{NOTES.excludedCosts}</p>
        <p>{DETAIL.taegEstimate}</p>
        <p>{MENU.privacy}</p>
      </div>
    </Sheet>
  )
}

function Action({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="card flex min-h-14 w-full items-center gap-4 rounded-2xl px-4 text-left font-medium hover:bg-surface">
      <span aria-hidden className="grid size-9 place-items-center rounded-full bg-action-wash text-action-ink [&_svg]:size-5">
        {icon}
      </span>
      {label}
    </button>
  )
}
