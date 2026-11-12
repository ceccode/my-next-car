import { useId } from 'react'

interface SwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
}

export function Switch({ label, checked, onChange, hint }: SwitchProps) {
  const id = useId()
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-line bg-card px-4 py-3">
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block font-medium">{label}</span>
        {hint ? <span className="mt-0.5 block text-sm text-ink-soft">{hint}</span> : null}
      </label>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="switch"
      />
    </div>
  )
}
