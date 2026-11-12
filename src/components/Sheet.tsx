import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { APP } from '@/lib/strings'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children: ReactNode
}

/** A bottom sheet on phones and a centred panel on larger screens. The native <dialog> traps focus and closes on Esc. */
export function Sheet({ open, onClose, title, description, children }: SheetProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
  }, [open])

  return (
    <dialog
      ref={dialog}
      className="sheet"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {open ? (
        <>
          <header className="flex items-start gap-4 px-6 pt-3 pb-4">
            <div className="min-w-0 flex-1">
              <div aria-hidden className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line md:hidden" />
              <h2 id={titleId} className="text-2xl font-semibold tracking-tight text-balance">
                {title}
              </h2>
              {description ? <div className="mt-1 text-ink-soft">{description}</div> : null}
            </div>
            <button type="button" onClick={onClose} className="icon-button mt-6 md:mt-0" aria-label={APP.close}>
              <X className="size-5" aria-hidden />
            </button>
          </header>
          <div className="overflow-y-auto overscroll-contain px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">{children}</div>
        </>
      ) : null}
    </dialog>
  )
}
