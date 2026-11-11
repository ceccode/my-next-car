import { buildExplanations, FIXED_BULLETS } from '@/domain/financing/explanations'
import { EXPLANATIONS } from '@/lib/strings'
import type { ComparisonResult } from '@/domain/financing/types'

export function Explanations({ result }: { result: ComparisonResult }) {
  if (result.globalErrors.length > 0) return null
  const sentences = buildExplanations(result)
  if (sentences.length === 0) return null
  return (
    <section aria-labelledby="explanations-title" className="space-y-3">
      <h2 id="explanations-title" className="text-2xl font-semibold">
        {EXPLANATIONS.title}
      </h2>
      <div className="space-y-2">
        {sentences.map((s) => (
          <p key={s} className="text-sm text-muted-foreground">
            {s}
          </p>
        ))}
      </div>
      <ul className="list-disc space-y-1 pl-5">
        {FIXED_BULLETS.map((b) => (
          <li key={b} className="text-sm text-muted-foreground">
            {b}
          </li>
        ))}
      </ul>
    </section>
  )
}
