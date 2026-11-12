---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Simulator (src/App.tsx)

Mode: Operate. Mobile-first consumer simulator, one screen.
Audience/job: Italian buyer, on a phone at home or at the dealer, wants to know what each way of paying really costs in total. Starts from price only; quote details later.
Constraints: domain engine untouched; it-IT, EUR; TAEG is an estimate; out-of-scope costs stated; WCAG 2.2 AA.

## Direction contract

THESIS: A warm consumer app where the price is the only thing you type; everything else is a thumb slider and the four totals answer live. Refuses the fintech form-plus-dashboard with six charts and a sidebar of fields.
OWN-WORLD: Warm tinted ground (#FFF4E6 family), white soft cards (24px radius), one saturated orange reserved for what you can touch and for the winning bar; dark warm brown text, warm gray secondary. Figtree, a rounded humanist sans, semibold display, tabular figures.
STORY: The visitor sees the price, sees four horizontal bars of total cost on one fixed shared scale, understands that a lower monthly payment is not a cheaper car, moves anticipo/durata/TAN and watches the bars and ranking change, taps a formula for its detail, and shares or exports from one menu.
FIRST VIEWPORT: 390 wide. Top bar: name left, menu button right. Card 1: price, large and editable in place. Card 2: "Quanto spendi in tutto", four rows ranked by total cost, bars on a shared scale, cheapest in orange, monthly payment under each name; one plain sentence of insight. Bottom dock (white, rounded top): sliders Anticipo, Durata, TAN, always under the thumb. Desktop: controls card left sticky, results right.
FORM: Warm consumer app surface (dealt challenger digital-design-canon-warm-consumer-app-surface, chosen by the user over the assigned Targa). Signature interaction: rows re-rank with a smooth FLIP slide and bars spring while the slider moves. seed:e5a2c9a6b3d28f5f
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
