# Coding Agent Prompt: My Next Car, simulatore finanziamento veicolo (v3)

## 0. How to work on this task (read first)

You are building a small open-source web application from scratch. This document is the complete specification. Follow it literally.

Working rules:

1. **Do not invent.** Every formula, field, default value, file name, UI text and expected test value you need is in this document. If something is not specified, choose the simplest option that satisfies the nearest requirement and record the choice in the "Assumptions" section of `README.md`. Never add a feature that is not requested here.
2. **Work in the phase order of section 17.** Each phase ends with a gate (commands that must pass). Do not start the next phase until the gate passes.
3. **Never edit an expected value in a test to make the test pass.** The expected values in section 16 were computed with a reference implementation of the algorithms in section 6. If a test fails, your implementation is wrong: fix the implementation.
4. **No placeholders.** No `TODO`, no stub functions, no mock data in the final code, no "coming soon" UI.
5. **Only the dependencies of section 2.** Do not write version numbers from memory into `package.json`: install with the commands in section 2 and let the tools write the versions.
6. **Do not guess component APIs.** shadcn/ui copies the source of each component into `src/components/ui/`. Before using a component, open its generated file and use only the exports and props you see there. Never edit the generated files and never put your own components in that folder.
7. **One source of truth for numbers.** Every number shown in the UI, charts or CSV comes from the result of `computeComparison` (section 7). React components never contain financial formulas.
8. **Never display `NaN`, `Infinity`, `undefined` or `null`** to the user. Invalid inputs produce a readable message (section 8).
9. **Language.** This specification is in English. Everything the user sees is in **Italian**, using exactly the Italian texts given here. Code identifiers, comments, README and commit messages are in English.
10. When you finish, write the final report described in section 20.

---

## 1. Product summary

A frontend-only single-page application for the **Italian market** that compares four ways of paying for the same vehicle: cash (contanti), traditional loan (finanziamento classico), balloon loan (finanziamento con maxirata) and financial leasing (leasing finanziario). It works for any vehicle that has a purchase price (car, motorcycle, van, new or used).

The user has two goals, and every design decision serves them:

1. **Understand which option is more convenient** ("capire cosa conviene"), given what matters to them: lowest total cost, lowest monthly payment, or lowest cash needed today.
2. **Run simulations**: change a value and immediately see how payments, interest and total cost change, and compare against a saved scenario.

The audience includes people with no financial knowledge. Terms such as TAN and TAEG must be explained in plain Italian wherever they appear (section 3).

Project name: **My Next Car**. Use `my-next-car` as the repository name and as the `name` field of `package.json`. The name stays in English and is never translated.

Page header: app name **"My Next Car"**, followed by the descriptor "Simulatore finanziamento veicolo" in smaller muted text. Subtitle: **"Capisci quanto ti costa davvero il tuo prossimo veicolo, prima di firmare."** The HTML `<title>` is "My Next Car | Simulatore finanziamento veicolo" and `<html lang="it">`.

Scope decisions already made (do not reopen them):

- User interface in Italian only. All user-visible strings live in one file, `src/lib/strings.ts`. No i18n library.
- Currency is EUR only. Numbers and currency are formatted with the locale `it-IT` (for example `46.990,00 €`, `7,49%`).
- All amounts are entered and shown **including VAT (IVA inclusa)**. There is no VAT logic.
- The comparison covers purchase and financing cost only. Fuel, electricity, insurance, maintenance, road tax (bollo auto), parking, tolls, depreciation, resale value, investment returns, opportunity cost and inflation are **out of scope** and must not be implemented. The page says so in a visible note (section 12).
- No backend, database, authentication, external API, API key, analytics, AI integration, cloud function, or font loaded from a third-party server.
- The app never suggests incentive amounts, market rates or real offers. Incentives are typed in by the user.

---

## 2. Technology stack and setup

Stack: Vite, React, TypeScript (strict mode), **shadcn/ui** for all interface components, Recharts through the shadcn `chart` component, Lucide React icons, Vitest. State is handled with React hooks only (`useState`, `useMemo`, `useEffect`). No state library, no router, no form library, no validation library, no date library, no decimal library, no animation library.

shadcn/ui requires Tailwind CSS, so Tailwind is installed by the shadcn scaffold. Do not configure Tailwind by hand. Build the interface from shadcn components; use Tailwind utility classes only for layout, spacing and typography around them.

Setup commands:

```bash
npx shadcn@latest init -t vite
npx shadcn@latest add button card input label slider tabs popover accordion table badge switch separator alert chart
npm install -D vitest
```

Notes on setup:

- The first command scaffolds a Vite + React + TypeScript project with Tailwind, the `@/` import alias and `components.json`. If it asks questions, accept the defaults. If it creates the project inside a new subfolder, that subfolder is the project root.
- After the commands, check that `recharts` and `lucide-react` are in `package.json`; if one is missing, install it with `npm install <name>`.
- If a command fails, follow the official guide at `https://ui.shadcn.com/docs/installation/vite`. Do not write Tailwind, PostCSS or alias configuration from memory.
- Keep the scripts created by the scaffold (`dev`, `build`, `preview`) and add `"test": "vitest run"`.
- Vitest needs no configuration file: domain tests run in the default Node environment. Do not install jsdom or a React testing library.
- `tsconfig` must keep `"strict": true`. The type `any` is forbidden in your own code under `src/` (the generated `src/components/ui/` files are exempt).

`netlify.toml` at the project root, exactly:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 3. Financial terms: how they are explained to the user

Making these terms clear is a core requirement, delivered in three ways:

1. **InfoTip on every label.** Create `src/components/common/InfoTip.tsx`: a small button with the Lucide `Info` icon and `aria-label="Spiegazione: {term}"` that opens a shadcn `Popover` containing the definition. It opens on click, tap and keyboard (Enter or Space). Every input label, card row and table row that uses a glossary term has an InfoTip next to it.
2. **"TAN e TAEG in breve" box.** A shadcn `Alert` placed directly above the comparison cards, with the text given below.
3. **Glossary section.** A section titled "Glossario" at the bottom of the page: a shadcn `Accordion` with one item per term, in the order of the table.

Text of the "TAN e TAEG in breve" box:

> **TAN e TAEG in breve.** Il **TAN** è il tasso di interesse "puro": serve a calcolare gli interessi, ma non comprende le spese. Il **TAEG** è il costo complessivo del finanziamento in percentuale annua: comprende interessi e spese obbligatorie. Per confrontare due offerte guarda il TAEG, non il TAN: un'offerta a TAN 0% può avere comunque un TAEG maggiore di zero.

Glossary (use these definitions verbatim; do not write different ones):

| Term | Definition |
|---|---|
| TAN (Tasso Annuo Nominale) | È il tasso di interesse annuo applicato al capitale che ti viene prestato. Serve a calcolare gli interessi di ogni rata. Non comprende spese, commissioni e imposte. |
| TAEG (Tasso Annuo Effettivo Globale) | È il costo complessivo del finanziamento, espresso in percentuale annua. Oltre agli interessi comprende le spese obbligatorie, come istruttoria, incasso rata, imposte e assicurazioni obbligatorie. È il numero da usare per confrontare offerte diverse: a parità di importo e durata, il TAEG più basso costa meno. |
| TAEG stimato | È il TAEG calcolato da questo simulatore con i dati che hai inserito. È una stima a scopo informativo: il TAEG ufficiale è solo quello scritto nel contratto o nel modulo informativo precontrattuale (SECCI). Nei contratti di leasing l'indicatore equivalente è spesso chiamato "tasso leasing". |
| Prezzo netto | Il prezzo del veicolo dopo sconti e incentivi, più i costi aggiuntivi di acquisto. |
| Permuta | Il veicolo che possiedi oggi e che cedi al venditore. Il suo valore riduce il denaro che devi versare, ma non è uno sconto: stai pagando con il valore del tuo veicolo. |
| Valore netto della permuta | Il valore del tuo veicolo attuale meno il debito ancora aperto su di esso. Può essere negativo. |
| Anticipo | Il denaro che versi alla firma, in aggiunta all'eventuale valore netto della permuta. Nel leasing si chiama anche maxicanone. |
| Importo finanziato | La parte del prezzo netto che non copri con anticipo e permuta, e che quindi ti viene prestata. Gli interessi si calcolano su questo importo. |
| Rata | Il pagamento mensile. Ogni rata contiene una quota di capitale (restituisci il prestito) e una quota di interessi (il costo del prestito). Nel leasing si chiama canone. |
| Maxirata | Un unico pagamento elevato alla fine del finanziamento, insieme all'ultima rata. Rende le rate mensili più basse, ma lascia una parte importante del debito da pagare alla fine. È chiamata anche rata finale o valore futuro garantito. |
| Riscatto | L'importo che paghi alla fine del leasing per diventare proprietario del veicolo. |
| Leasing finanziario | Un contratto in cui la società di leasing acquista il veicolo e te lo concede in uso in cambio di canoni mensili. Diventi proprietario solo se paghi il riscatto finale. È diverso dal noleggio a lungo termine, che questo simulatore non considera. |
| Spese iniziali | Spese e imposte pagate una sola volta alla firma, ad esempio spese di istruttoria e imposta di bollo o imposta sostitutiva. |
| Spese mensili | Un importo fisso aggiunto a ogni rata, ad esempio le spese di incasso rata. |
| Interessi totali | La somma di tutti gli interessi pagati durante il contratto. |
| Costo totale | Prezzo netto più interessi totali più tutte le spese del finanziamento, nell'ipotesi che tu tenga il veicolo alla fine. |
| Esborso totale | Tutto il denaro che esce dal tuo conto: il costo totale meno il valore netto della permuta. |
| Piano di ammortamento | La tabella che mostra, mese per mese, quanta parte della rata è capitale, quanta è interessi e quanto debito resta. |

Rules for the TAEG:

- The number computed by the app is always labelled **"TAEG stimato"**. Never label it "TAEG" alone.
- Each financed method has an optional input "TAEG indicato nel preventivo (%)". When it is greater than 0, the card compares it with the estimate (section 6.9).

---

## 4. Inputs

All money inputs are non-negative euro amounts with up to two decimals. All numeric inputs are the shadcn `Input` with `type="number"` and `inputMode="decimal"`; read the value with `valueAsNumber` and treat an empty or non-numeric value as `0`.

### 4.1 Step 1, "Il veicolo"

| Label (Italian) | Key | Type | Range / options | Example value |
|---|---|---|---|---|
| Nome del veicolo (facoltativo) | `vehicle.name` | text, max 60 chars | any | `"Veicolo di esempio"` |
| Alimentazione (facoltativo) | `vehicle.type` | Tabs used as segmented control | `electric` "Elettrica", `hybrid` "Ibrida", `combustion` "Termica", `other` "Altro" | `other` |
| Condizione | `vehicle.condition` | Tabs used as segmented control | `new` "Nuovo", `used` "Usato" | `new` |
| Prezzo di listino (IVA inclusa) | `acquisition.listPrice` | money | greater than 0, max 10,000,000 | `46990` |
| Sconti del venditore | `acquisition.discount` | money | 0 or more | `0` |
| Incentivo rottamazione | `acquisition.scrappageIncentive` | money | 0 or more | `0` |
| Altri incentivi o contributi | `acquisition.otherIncentives` | money | 0 or more | `0` |
| Costi aggiuntivi (messa su strada, immatricolazione, IPT) | `acquisition.additionalCosts` | money | 0 or more | `0` |

Name, type and condition are informational only: they never affect any calculation. Below the fields show the computed line "Prezzo netto: {netPurchasePrice}".

### 4.2 Step 2, "La tua permuta (facoltativo)"

| Label | Key | Example value |
|---|---|---|
| Valore del veicolo che dai in permuta | `acquisition.tradeInValue` | `0` |
| Debito residuo sul veicolo attuale | `acquisition.tradeInOutstandingLoan` | `0` |

Below the fields show "Valore netto della permuta: {equity}" and one of these notes:

- Equity greater than 0: "La permuta copre {equity} dell'acquisto. Riduce il denaro che devi versare, ma non è uno sconto: stai pagando con il valore del tuo veicolo attuale."
- Equity less than 0: "Il tuo veicolo attuale vale {abs(equity)} meno del debito ancora aperto. Questa somma va comunque pagata: si aggiunge al denaro da versare o all'importo finanziato."
- Equity equal to 0: no note.

### 4.3 Step 3, "Le offerte di finanziamento"

**Shared values block**, titled "Valori comuni": five inputs, Anticipo, Durata (mesi), TAN (%), Spese iniziali, Spese mensili (keys `shared.downPayment`, `shared.months`, `shared.tanPercent`, `shared.upfrontFees`, `shared.monthlyFee`), plus one button **"Applica a tutti i finanziamenti"**. Clicking it copies the five values into the loan, the balloon loan and the leasing (leasing `initialPayment` receives the down payment). There is no live link: after copying, each method is edited independently. Example values: `10000`, `60`, `7.49`, `300`, `3`.

Ranges for every method: `months` is an integer from 6 to 120; `tanPercent` is from 0 to 30 with up to two decimals; `quotedTaegPercent` is from 0 to 40, where 0 means "not provided". Down payment, duration, TAN and final payment each have a shadcn `Slider` plus a numeric `Input` bound to the same value. Slider ranges: duration 6 to 120 step 6; TAN 0 to 15 step 0.05; down payment and final payment 0 to the net purchase price, step 500. The numeric input accepts any valid value, also outside the slider range.

**Finanziamento classico** (`loan`)

| Label | Key | Example value |
|---|---|---|
| Anticipo | `downPayment` | `10000` |
| Durata (mesi) | `months` | `60` |
| TAN (%) | `tanPercent` | `7.49` |
| Spese iniziali | `upfrontFees` | `300` |
| Spese mensili | `monthlyFee` | `3` |
| TAEG indicato nel preventivo (%) (facoltativo) | `quotedTaegPercent` | `0` |

**Finanziamento con maxirata** (`balloon`): the same six fields plus:

| Label | Key | Example value |
|---|---|---|
| Anticipo | `downPayment` | `8000` |
| Maxirata finale | `balloonPayment` | `17477` |
| Il contratto prevede la restituzione del veicolo (shadcn `Switch`) | `returnOptionEnabled` | `false` |
| Costi stimati di restituzione (shown only when the switch is on) | `returnFees` | `0` |

Other balloon example values: `months` 60, `tanPercent` 7.49, `upfrontFees` 300, `monthlyFee` 3, `quotedTaegPercent` 0.

**Leasing finanziario** (`leasing`)

| Label | Key | Example value |
|---|---|---|
| Come vuoi inserire i dati? (Tabs: `calculated` "Calcola il canone dal TAN", `quoted` "Ho già un preventivo") | `mode` | `calculated` |
| Anticipo (maxicanone) | `initialPayment` | `9700` |
| Durata (mesi) | `months` | `60` |
| TAN (%), shown only in `calculated` mode | `tanPercent` | `7.49` |
| Canone mensile del preventivo, shown only in `quoted` mode | `quotedMonthlyPayment` | `545` |
| Riscatto finale | `buyout` | `14669` |
| Spese iniziali | `upfrontFees` | `300` |
| Spese mensili | `monthlyFee` | `3` |
| TAEG indicato nel preventivo (%) (facoltativo) | `quotedTaegPercent` | `0` |
| Il contratto prevede la restituzione del veicolo (Switch) | `returnOptionEnabled` | `false` |
| Costi stimati di restituzione (shown only when the switch is on) | `returnFees` | `0` |

The return option is always off by default. Never state or imply that a balloon loan or a lease can be ended by returning the vehicle unless the user has switched it on.

Wherever the example scenario is loaded, show the note: "I valori di esempio sono ipotetici e non rappresentano un'offerta."

---

## 5. State shape

`src/domain/financing/types.ts` defines the UI state exactly like this (amounts in euros, as typed by the user):

```ts
export interface SimulationState {
  schemaVersion: 1;
  vehicle: {
    name: string;
    type: 'electric' | 'hybrid' | 'combustion' | 'other';
    condition: 'new' | 'used';
  };
  acquisition: {
    listPrice: number;
    discount: number;
    scrappageIncentive: number;
    otherIncentives: number;
    additionalCosts: number;
    tradeInValue: number;
    tradeInOutstandingLoan: number;
  };
  shared: { downPayment: number; months: number; tanPercent: number; upfrontFees: number; monthlyFee: number };
  loan: {
    downPayment: number; months: number; tanPercent: number; upfrontFees: number; monthlyFee: number;
    quotedTaegPercent: number;
  };
  balloon: {
    downPayment: number; months: number; tanPercent: number; upfrontFees: number; monthlyFee: number;
    quotedTaegPercent: number;
    balloonPayment: number; returnOptionEnabled: boolean; returnFees: number;
  };
  leasing: {
    mode: 'calculated' | 'quoted';
    initialPayment: number; months: number; tanPercent: number; quotedMonthlyPayment: number;
    buyout: number; upfrontFees: number; monthlyFee: number;
    quotedTaegPercent: number;
    returnOptionEnabled: boolean; returnFees: number;
  };
}
```

`src/data/exampleScenario.ts` exports one `SimulationState` built from the example values in section 4.

---

## 6. Financial engine: formulas and algorithms

The engine is pure TypeScript in `src/domain/financing/`. It imports nothing from React. Every function is deterministic and returns plain serializable objects.

### 6.1 Money representation

Inside the engine every amount is an **integer number of cents** (type alias `Cents = number`). Convert at the boundary only:

- `toCents(x) = Math.round(x * 100)` when reading `SimulationState`.
- Divide by 100 only when formatting for display or CSV.

Rounding rule everywhere: `Math.round` to the nearest cent. All rounded quantities are non-negative, so `Math.round` is round-half-up.

### 6.2 Acquisition

```
netPurchasePrice N = listPrice - discount - scrappageIncentive - otherIncentives + additionalCosts
tradeInEquity    E = tradeInValue - tradeInOutstandingLoan        (may be negative)
```

Each of discount, incentives, trade-in value and outstanding loan appears in exactly one of these two formulas and nowhere else. This is what prevents double counting.

### 6.3 Cash purchase

```
initialCash       = N - E
totalInterest     = 0
totalFees         = 0
totalEconomicCost = N
totalCashPaid     = N - E
```

If `N - E` is negative (the trade-in is worth more than the new vehicle) the method is still valid; show the label "Ricevi" with the absolute value instead of "Da versare subito".

### 6.4 Quantities common to the three financed methods

Let `D` be the down payment (for leasing: the initial payment), `n` the number of months, `B` the final payment (loan: `0`; balloon: `balloonPayment`; leasing: `buyout`), `U` the upfront fees and `F` the monthly fee.

```
principal P        = N - E - D
initialCash        = D + U                      (upfront fees are paid in cash at signing and are never financed)
totalFees          = U + n * F
totalInterest      = sum of the interest column of the schedule
totalInstallments  = sum of the payment column of the schedule   (excludes B and fees)
totalEconomicCost  = N + totalInterest + totalFees
totalCashPaid      = N - E + totalInterest + totalFees
extraCostVsCash    = totalInterest + totalFees
monthlyInstallment = M                           (first-row payment of the schedule)
monthlyOutflow     = M + F                       (this is the "Rata mensile" shown in the UI)
costIfReturned     = initialCash + totalInstallments + n * F + returnFees   (only when returnOptionEnabled, otherwise null)
```

Self-check that must always hold (assert it in tests): `initialCash + totalInstallments + n * F + B == totalCashPaid`.

Negative trade-in equity increases `P` (the old debt is rolled into the new financing). The trade-in equity is contributed in kind and is never part of `initialCash`.

### 6.5 Installment and schedule (loan, balloon, leasing in calculated mode)

Payments are made at the end of each month (months 1 to n). The final payment `B` is due at month `n` together with installment number `n`. Leasing in calculated mode uses exactly the same mathematics as the balloon loan with `B = buyout`; this simplification must be stated in the README under "Financial assumptions".

Use these two functions verbatim:

```ts
export function computeInstallment(P: Cents, B: Cents, n: number, tanPercent: number): Cents {
  const r = tanPercent / 100 / 12;
  if (r === 0) return Math.round((P - B) / n);
  const v = Math.pow(1 + r, -n);
  return Math.round(((P - B * v) * r) / (1 - v));
}

export interface ScheduleRow {
  month: number;      // 1..n
  payment: Cents;     // installment, without the monthly fee and without the final payment
  interest: Cents;
  principal: Cents;
  balance: Cents;     // remaining principal after this installment; at month n it equals B
}

export function buildSchedule(P: Cents, B: Cents, n: number, tanPercent: number): ScheduleRow[] {
  const r = tanPercent / 100 / 12;
  const M = computeInstallment(P, B, n, tanPercent);
  const rows: ScheduleRow[] = [];
  let balance = P;
  for (let month = 1; month <= n; month++) {
    const interest = Math.round(balance * r);
    let principal = M - interest;
    let payment = M;
    if (month === n) {            // the last installment absorbs the rounding difference
      principal = balance - B;
      payment = principal + interest;
    }
    balance -= principal;
    rows.push({ month, payment, interest, principal, balance });
  }
  return rows;
}
```

Consequences: the last installment can differ from `M` by a few cents; the balance after month `n` is exactly `B`; with a 0% rate every interest value is `0`.

### 6.6 Rate solver (used for leasing in quoted mode and for the TAEG stimato)

Use this function verbatim. `payments[0]` is the payment at month 1.

```ts
export function solveMonthlyRate(amount: Cents, payments: Cents[]): number | null {
  const pv = (i: number) => payments.reduce((s, p, idx) => s + p / Math.pow(1 + i, idx + 1), 0);
  const total = payments.reduce((s, p) => s + p, 0);
  if (amount <= 0 || total < amount) return null;
  if (total === amount) return 0;
  let lo = 0;
  let hi = 1;                      // 100% per month upper bound
  if (pv(hi) > amount) return null;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (pv(mid) > amount) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
```

### 6.7 Leasing in quoted mode

Inputs: `P` (from 6.4), quoted monthly payment `M`, `n`, `B = buyout`.

1. Build `payments`: `n` entries equal to `M`, then add `B` to the last entry.
2. `r = solveMonthlyRate(P, payments)`. If `r` is `null`, the method is invalid with the message "I pagamenti del preventivo sono inferiori all'importo finanziato. Controlla canone mensile, anticipo e riscatto."
3. Implied TAN in percent: `r * 12 * 100`, displayed with two decimals and the label "TAN implicito (stimato)".
4. Schedule: for each month, `interest = Math.round(balance * r)`, `principal = M - interest`, `payment = M`. At month `n`: `principal = balance - B`, `interest = M - principal`, `payment = M`. As a result `totalInterest == n * M + B - P` exactly.

### 6.8 TAEG stimato (each financed method)

1. Build `payments`: for month `k`, `schedule[k].payment + F`; add `B` to the last entry.
2. `i = solveMonthlyRate(P - U, payments)`.
3. If `i` is `null`, the value is `null` and the UI shows "n.d.". Otherwise `estimatedTaegPercent = (Math.pow(1 + i, 12) - 1) * 100`, displayed with two decimals.

### 6.9 Comparison with the TAEG of the quote

`compareTaeg(estimated: number | null, quoted: number): 'none' | 'aligned' | 'higher' | 'lower'`

- `quoted <= 0` or `estimated === null`: `'none'`, show nothing.
- `Math.abs(quoted - estimated) <= 0.3`: `'aligned'`. Text: "Il TAEG del preventivo ({quoted}) è in linea con quello stimato ({estimated})."
- `quoted > estimated + 0.3`: `'higher'`. Text: "Il TAEG del preventivo ({quoted}) è più alto di quello stimato ({estimated}). Il preventivo include probabilmente costi che non hai inserito, ad esempio assicurazioni o servizi accessori: chiedi il dettaglio delle spese."
- `quoted < estimated - 0.3`: `'lower'`. Text: "Il TAEG del preventivo ({quoted}) è più basso di quello stimato ({estimated}). Controlla le spese e il TAN che hai inserito."

---

## 7. Engine API

`src/domain/financing/comparison.ts` exports one entry point used by the UI:

```ts
export function computeComparison(state: SimulationState): ComparisonResult
```

Define these result types in `types.ts`:

```ts
export type MethodKind = 'cash' | 'loan' | 'balloon' | 'leasing';
export type FinancedKind = 'loan' | 'balloon' | 'leasing';

export interface MethodInvalid { kind: MethodKind; valid: false; errors: string[] }

export interface CashResult {
  kind: 'cash'; valid: true;
  initialCash: Cents; totalInterest: 0; totalFees: 0;
  totalEconomicCost: Cents; totalCashPaid: Cents; extraCostVsCash: 0;
}

export interface FinancedResult {
  kind: FinancedKind; valid: true;
  principal: Cents; months: number;
  monthlyInstallment: Cents; monthlyFee: Cents; monthlyOutflow: Cents;
  finalPayment: Cents; initialCash: Cents;
  totalInstallments: Cents; totalInterest: Cents; totalFees: Cents;
  totalEconomicCost: Cents; totalCashPaid: Cents; extraCostVsCash: Cents;
  nominalRatePercent: number;                 // input TAN, or implied TAN in quoted mode
  nominalRateIsEstimated: boolean;            // true only for leasing in quoted mode
  estimatedTaegPercent: number | null;
  quotedTaegPercent: number;                  // 0 when not provided
  taegComparison: 'none' | 'aligned' | 'higher' | 'lower';
  schedule: ScheduleRow[];
  returnOptionEnabled: boolean; costIfReturned: Cents | null;
  ownerDuringContract: boolean;               // loan: true, balloon: true, leasing: false
}

export interface ComparisonResult {
  netPurchasePrice: Cents; tradeInEquity: Cents;
  globalErrors: string[];                     // errors of section 8.1
  cash: CashResult | MethodInvalid;
  loan: FinancedResult | MethodInvalid;
  balloon: FinancedResult | MethodInvalid;
  leasing: FinancedResult | MethodInvalid;
  lowestCostKinds: MethodKind[];              // valid methods with the minimum totalEconomicCost (ties: all)
  lowestCostFinancedKinds: FinancedKind[];    // same, among valid financed methods
  lowestMonthlyKinds: FinancedKind[];         // valid financed methods with the minimum monthlyOutflow
  lowestInitialCashKinds: FinancedKind[];     // valid financed methods with the minimum initialCash
}
```

`src/hooks/useSimulation.ts` holds the `SimulationState` and the optional saved scenario in `useState`, computes `useMemo(() => computeComparison(state), [state])` and the same for the saved scenario, and handles persistence (section 14). File layout:

```text
src/
  App.tsx
  components/ui/          generated by shadcn, never edited
  components/common/      InfoTip, MoneyField, SliderField, AnimatedNumber
  components/forms/       VehicleForm, TradeInForm, SharedForm, LoanForm, BalloonForm, LeasingForm
  components/results/     Verdict, ComparisonCards, ComparisonTable, Explanations, Glossary
  components/charts/      one file per chart
  domain/financing/       types.ts, acquisition.ts, amortization.ts, rate.ts, comparison.ts,
                          validation.ts, explanations.ts, sensitivity.ts, *.test.ts
  hooks/useSimulation.ts
  lib/                    utils.ts (generated by shadcn), format.ts, strings.ts, storage.ts, sharing.ts, csv.ts
  data/exampleScenario.ts
  main.tsx
```

If the scaffold places files differently (for example `src/index.css`), keep the scaffold's locations. Do not add interfaces, services, factories, contexts or abstraction layers beyond this.

---

## 8. Validation

Implemented in `validation.ts` and called by `computeComparison`. Field-level errors are also shown under the input.

### 8.1 Global errors (when present, all four methods are invalid and the results area shows only the messages)

| Condition | Message |
|---|---|
| `listPrice <= 0` | "Inserisci un prezzo del veicolo maggiore di zero." |
| `N < 0` | "Sconti e incentivi superano il prezzo del veicolo." |
| Any money input negative or not finite | "Gli importi non possono essere negativi." |

### 8.2 Per-method errors (only that method is invalid; the others are still computed)

| Condition | Message |
|---|---|
| `months` not an integer in 6..120 | "La durata deve essere compresa tra 6 e 120 mesi." |
| `tanPercent` outside 0..30 | "Il TAN deve essere compreso tra 0% e 30%." |
| `P < 0` | "Anticipo e permuta superano il prezzo: non c'è nulla da finanziare." |
| `P == 0` | "L'importo da finanziare è zero: si tratta di un acquisto in contanti." |
| Balloon or leasing: `B > P` | "Il pagamento finale non può superare l'importo finanziato." |
| Leasing quoted mode: `quotedMonthlyPayment <= 0` | "Inserisci il canone mensile del preventivo." |
| Leasing quoted mode: solver returns `null` | message of section 6.7 |

An invalid method shows its messages in its card, shows a dash in its table column, and is omitted from the verdict, from every chart and from the `lowest...Kinds` lists.

---

## 9. Experience and page layout

The interface is minimal: few elements, generous whitespace, large numbers. The "wow" effect comes only from the charts and from the live reaction of numbers and charts to every change. No decorative images, gradients or illustrations.

Method names used everywhere: `cash` "Contanti"; `loan` "Finanziamento classico"; `balloon` "Finanziamento con maxirata"; `leasing` "Leasing finanziario". When a sentence needs an article use: "il pagamento in contanti", "il finanziamento classico", "il finanziamento con maxirata", "il leasing".

Single page, no routing.

- **Header**: app name, descriptor and subtitle of section 1, and three shadcn `Button`s: "Copia link" (Lucide `Link`), "Esporta CSV" (`Download`), "Ripristina esempio" (`RotateCcw`).
- **Desktop (1024px and above)**: two columns. The left column (about 400px, sticky, independently scrollable) holds the inputs as three numbered steps with these headings: "1. Il veicolo", "2. La tua permuta (facoltativo)", "3. Le offerte di finanziamento". Step 3 contains the "Valori comuni" block and then a shadcn `Accordion` with three items (Finanziamento classico, Finanziamento con maxirata, Leasing finanziario), the first one open.
- **Right column**, in this order: Verdict (section 10.1), "TAN e TAEG in breve" box, comparison cards, charts inside shadcn `Tabs`, explanations, comparison table, excluded-costs note, glossary.
- **Mobile (below 1024px)**: one column: header, steps 1 to 3, then results in the same order. The chart tab list and the comparison table scroll horizontally inside their own containers; the page body never scrolls sideways.

**Live feedback.**

- Results recompute on every input change. There is no "Calcola" button.
- `AnimatedNumber`: a component that, when its value changes, animates from the old value to the new one in 300 ms using `requestAnimationFrame`, formatting each frame with the same formatter. If `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, it shows the new value immediately. Use it for the main numbers of the verdict and of the cards.
- Recharts animations are enabled with `animationDuration={300}`, and disabled when reduced motion is requested.

---

## 10. Results

### 10.1 Verdict, titled "Cosa conviene"

The first block of the results. It answers the user's main question without giving advice: it shows which option wins for each objective.

- Headline, large: "Il costo totale più basso è {method name}: {totalEconomicCost}." using the first element of `lowestCostKinds`. If more than one method ties, list them joined by " e ".
- Subtitle: "Dipende da cosa conta di più per te:"
- Four tiles (shadcn `Card`), each with a Lucide icon, a title, the method name and a number:

| Title | Method | Number and caption |
|---|---|---|
| "Spendi meno in totale" (`PiggyBank`) | `lowestCostKinds` | `totalEconomicCost`, caption "costo totale" |
| "Il finanziamento meno caro" (`BadgeCheck`) | `lowestCostFinancedKinds` | `extraCostVsCash` with a plus sign, caption "in più rispetto ai contanti" |
| "La rata più bassa" (`CalendarDays`) | `lowestMonthlyKinds` | `monthlyOutflow`, caption "al mese". If this method is not in `lowestCostFinancedKinds`, add: "ma costa {difference in totalEconomicCost} in più del finanziamento meno caro" |
| "Meno soldi da versare subito" (`Wallet`) | `lowestInitialCashKinds` | `initialCash`, caption "alla firma" |

If no financed method is valid, show only the first tile. Never use the words "migliore" or "consigliato".

### 10.2 Comparison cards

One shadcn `Card` per method, in the order Contanti, Finanziamento classico, Finanziamento con maxirata, Leasing finanziario (four columns on wide screens, two on tablets, one on phones). The total cost is the largest number on the card.

| Label | Value |
|---|---|
| Costo totale se tieni il veicolo | `totalEconomicCost` |
| Rata mensile | `monthlyOutflow` (cash: "nessuna") |
| Da versare subito | `initialCash` |
| Durata | `months` + " mesi" (cash: a dash) |
| Pagamento finale | `finalPayment` with the label "Maxirata" for balloon and "Riscatto" for leasing (cash and loan: "nessuno") |
| Interessi totali | `totalInterest` |
| Spese | `totalFees` |
| TAN | `nominalRatePercent`; in quoted mode with the label "TAN implicito (stimato)" |
| TAEG stimato | section 6.8, followed by the text of section 6.9 when it applies |
| In più rispetto ai contanti | "+{extraCostVsCash}"; when 0: "stesso costo dei contanti"; for cash: "riferimento" |

Badges (shadcn `Badge`): methods in `lowestCostKinds` get "Costo totale più basso". If cash is the only member of `lowestCostKinds`, the methods in `lowestCostFinancedKinds` get "Finanziamento meno caro". The methods in `lowestMonthlyKinds` get the secondary badge "Rata più bassa".

When `returnOptionEnabled` is on, the card adds: "Se restituisci il veicolo alla fine: paghi {costIfReturned} in totale e non resti proprietario del veicolo."

The balloon card contains a one-item shadcn `Accordion` titled "Cosa succede alla fine del contratto?" with this fixed text (text only, no calculations):

1. Paghi la maxirata e tieni il veicolo. È l'ipotesi usata nel confronto.
2. Rifinanzi la maxirata con un nuovo prestito. Questo aggiunge nuovi interessi, non compresi nei numeri qui sopra.
3. Vendi il veicolo e usi il ricavato per pagare la maxirata. Il risultato dipende dal valore di mercato in quel momento, che questo simulatore non stima.
4. Restituisci il veicolo, solo se il tuo contratto lo prevede.

The leasing card contains the fixed note: "Durante il leasing il veicolo è di proprietà della società di leasing. Diventi proprietario solo dopo aver pagato il riscatto."

### 10.3 Saved scenario ("Scenario di confronto")

This is the simulation feature that lets the user answer "what changes if...".

- Below the verdict there is a button "Salva come scenario di confronto" (Lucide `Bookmark`). It stores a copy of the current `SimulationState`.
- While a saved scenario exists, show the line "Stai confrontando con lo scenario salvato." and the buttons "Aggiorna scenario salvato" and "Rimuovi confronto".
- While a saved scenario exists, every card shows, under "Costo totale" and under "Rata mensile", the difference between the current value and the saved-scenario value for the same method: "▼ {abs(diff)} in meno rispetto allo scenario salvato" in green, or "▲ {abs(diff)} in più rispetto allo scenario salvato" in red, or nothing when the difference is 0 or when the method is invalid in either scenario. The arrow and the words carry the meaning, not the color alone.

### 10.4 Comparison table

A shadcn `Table` under the heading "Confronto dettagliato", methods as columns. Rows, each with an InfoTip:

| Row | Source |
|---|---|
| Da versare subito | `initialCash` |
| Rata mensile | `monthlyOutflow` |
| Numero di rate | `months` |
| Pagamento finale | `finalPayment` |
| Interessi totali | `totalInterest` |
| Spese | `totalFees` |
| TAN | `nominalRatePercent` |
| TAEG stimato | `estimatedTaegPercent` |
| Esborso totale | `totalCashPaid` |
| Costo totale | `totalEconomicCost` |
| Proprietario durante il contratto | Cash, loan, balloon: "Tu". Leasing: "Società di leasing" |
| Proprietario alla fine | Cash, loan: "Tu". Balloon: "Tu, dopo la maxirata". Leasing: "Tu, dopo il riscatto" |
| Possibilità di restituzione | Cash, loan: "Non prevista". Balloon, leasing: "Sì, da contratto" when enabled, otherwise "No" |

---

## 11. Charts

Charts are the centrepiece of the page. They sit in a shadcn `Tabs` component under the heading "Grafici", one tab per chart, in the order below, with the first tab selected.

Technical rules:

- Use the shadcn `chart` component (`ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartConfig`) together with Recharts components, as in the generated `src/components/ui/chart.tsx`. Give every `ChartContainer` an explicit height: `className="h-[380px] w-full"` on desktop and `h-[280px]` on mobile.
- Charts read only from `ComparisonResult` (and from `sensitivity.ts` for the last one).
- Every chart has a title that is a question, a one-sentence caption, a legend with text labels, axes and tooltips formatted in euros, and below it a one-item shadcn `Accordion` titled "Mostra i dati in tabella" with the same data as a shadcn `Table`.
- Fixed series colors, set through `ChartConfig`: net price / principal `#0A66C2` (blue); interest `#F2C84B` (amber); fees `#8A8A8A` (gray); cash `#2E7D32` (green). In line charts: loan blue, balloon amber, leasing gray, cash green, and each line also has a different `strokeDasharray` so that color is not the only distinction.

| Tab label | Chart |
|---|---|
| "Costo totale" | Chart 1 |
| "Quando paghi" | Chart 2 |
| "Debito residuo" | Chart 3 |
| "Interessi e capitale" | Chart 4 |
| "Uscite nel tempo" | Chart 5 |
| "E se cambiasse...?" | Chart 6 |

**Chart 1, "Quanto costa davvero ogni soluzione?"** Stacked bar chart, one bar per valid method. Segments: "Prezzo netto" (`netPurchasePrice`), "Interessi" (`totalInterest`), "Spese" (`totalFees`). The bar height equals `totalEconomicCost`; show the total above each bar. Caption: "La parte blu è uguale per tutti. Tutto ciò che sta sopra è il costo del finanziamento."

**Chart 2, "Quando devo pagare?"** Stacked bar chart, one bar per valid method. Segments: "Alla firma" (`initialCash`, or 0 if negative), "Rate mensili" (`totalInstallments + months * monthlyFee`), "Pagamento finale" (`finalPayment`). Caption: "Una rata bassa può nascondere un pagamento finale elevato." If trade-in equity is not zero add: "Il valore della permuta non compare qui perché non è un pagamento in denaro."

**Chart 3, "Quanto debito mi resta, mese dopo mese?"** Line chart, x axis is the month from 0 to the longest duration. One line per valid financed method: value at month 0 is `principal`, value at month k is `schedule[k-1].balance`. A line ends at its own last month. Caption: "Con la maxirata o il leasing il debito scende lentamente: quello che resta alla fine è il pagamento finale." Leasing in quoted mode adds: "La linea del leasing usa il tasso implicito stimato dal preventivo."

**Chart 4, "Quanta parte della rata sono interessi?"** A Tabs control selects one valid financed method (default: loan). Stacked bar chart, one bar per month: "Capitale" and "Interessi" from the schedule. The tooltip shows month, rata, capitale, interessi and debito residuo. The final payment is not drawn; the caption states it: "Alla rata {months} si aggiunge un pagamento finale di {finalPayment}." (omit this sentence when the final payment is 0). The data table is the full amortization schedule, titled "Piano di ammortamento".

**Chart 5, "Quanti soldi escono dal mio conto nel tempo?"** Line chart, x axis is the month from 0 to the longest duration. For each valid method: month 0 is `initialCash`; each month k adds `schedule[k-1].payment + monthlyFee`; the last month also adds `finalPayment`. After a contract ends its line stays flat. Cash is a flat line at `initialCash`. Caption: "Mostra il denaro che esce dal conto nel tempo. Il punto finale di ogni linea è l'esborso totale."

**Chart 6, "E se cambiasse...?"** The interactive simulation. Implemented by `sensitivity.ts`, which calls the same engine functions with a modified copy of the state. Three Tabs controls: method (Finanziamento classico, Finanziamento con maxirata, Leasing finanziario), parameter ("TAN", "Durata", "Anticipo", "Pagamento finale"), metric ("Rata mensile", "Interessi totali", "Costo totale"). Values tested:

| Parameter | Values | Clamping |
|---|---|---|
| TAN | current value plus -3, -2, -1, 0, +1, +2, +3 percentage points | 0 to 30 |
| Durata | current value plus -24, -12, 0, +12, +24 months | 6 to 120 |
| Anticipo | current value plus -3, -2, -1, 0, +1, +2, +3 steps; one step is 5% of the net purchase price rounded to whole euros | 0 or more |
| Pagamento finale (balloon and leasing only) | same steps as Anticipo | 0 or more |

Remove duplicate values after clamping and skip values that make the method invalid. Show a line chart with dots of the chosen metric against the parameter value, with a Recharts `ReferenceLine` at the current value labelled "Oggi", and a table with the columns: valore, rata mensile, interessi totali, costo totale. Under the chart show one generated sentence comparing the first and last tested values: "Passando da {first value} a {last value}, {metric name} passa da {metric at first} a {metric at last}." When leasing is in quoted mode, the leasing choice shows: "La simulazione è disponibile per il leasing solo nella modalità «Calcola il canone dal TAN»." No Monte Carlo and no forecasting.

---

## 12. Explanations

Section title: **"Una rata più bassa non significa un veicolo meno caro."**

`explanations.ts` exports `buildExplanations(result: ComparisonResult): string[]`. It is deterministic: it fills the templates below with formatted values. No AI and no external API. Include a sentence only when its condition is true.

| Condition | Template |
|---|---|
| Loan and balloon both valid | "Il finanziamento con maxirata costa {abs(balloon.totalEconomicCost - loan.totalEconomicCost)} in {più/meno} del finanziamento classico, ma la rata mensile è {più bassa/più alta} di {abs(balloon.monthlyOutflow - loan.monthlyOutflow)}. Il motivo principale è che {balloon.finalPayment} di capitale restano da pagare alla fine." |
| Leasing valid | "Con il leasing paghi {leasing.totalCashPaid - leasing.finalPayment} durante il contratto e altri {leasing.finalPayment} per diventare proprietario." |
| For each valid financed method | "{Method name with article, capitalized} aggiunge {extraCostVsCash} al costo del veicolo: {totalInterest} di interessi e {totalFees} di spese." |
| The first element of `lowestMonthlyKinds` is not in `lowestCostFinancedKinds` | "{Method A with article, capitalized} ha la rata più bassa, ma {method B with article} ha il costo totale più basso." |
| At least one financed method valid | "Pagare in contanti evita interessi e spese, ma richiede {cash.initialCash} disponibili subito." |

After the generated sentences show four fixed bullet points:

- "Un pagamento finale più alto abbassa la rata, ma lascia più debito per dopo."
- "Una durata più lunga abbassa la rata, ma aumenta gli interessi totali."
- "Un anticipo più alto riduce l'importo finanziato e quindi gli interessi."
- "Leasing e maxirata possono avere condizioni diverse su proprietà e restituzione: controlla il contratto."

Note about excluded costs, always visible below the comparison table: "Questo simulatore confronta solo i costi di acquisto e di finanziamento. Carburante o ricarica, assicurazione, manutenzione, bollo auto, parcheggi, pedaggi, svalutazione e valore di rivendita non sono inclusi. I risultati sono stime a scopo informativo: non costituiscono un'offerta né una consulenza finanziaria. Gli importi si intendono IVA inclusa."

---

## 13. Visual design and accessibility

- Use the default shadcn theme tokens for backgrounds, text, borders and radius. Set the primary color to `#0A66C2` by changing the `--primary` CSS variable in the stylesheet generated by shadcn. Light theme only: do not implement dark mode.
- Font: the font configured by the shadcn scaffold if it is bundled locally, otherwise the system font stack. Never load fonts from a third-party server. Numbers use the class `tabular-nums`.
- Typography scale: the verdict headline is the largest text of the page; the total cost on each card is the next largest; labels are small and use the muted text color.
- No heavy shadows, no gradients, no decorative images. The only motion is the number animation, the chart animation and the default shadcn transitions.
- Formatting (`format.ts`): `formatMoney(cents)` uses `new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })`; `formatMoneyRounded(cents)` is the same with `maximumFractionDigits: 0` and is used for the verdict headline, chart axes and bar totals; `formatPercent(value)` uses `it-IT` with exactly two decimals followed by `%`.
- Accessibility: semantic HTML (`header`, `main`, `section`, `h1` to `h3`); every input has a shadcn `Label` connected with `htmlFor`; error messages are linked with `aria-describedby`; all controls are usable with the keyboard; visible focus ring; text contrast of at least 4.5:1; every chart has its data table.

---

## 14. Persistence, sharing, reset, export

**Validation of loaded data.** `storage.ts` exports `parseSimulation(value: unknown): SimulationState | null`. It returns `null` unless `schemaVersion === 1` and every field of section 5 exists with the correct type, every number is finite, and every enumerated field has one of its allowed values. It is used for localStorage and for shared links. Future schema versions will add a migration step in this function; add a comment saying so and nothing more.

**Load order at startup.** (1) If the URL hash starts with `#s=`, decode it; if `parseSimulation` accepts it, use it and then remove the hash with `history.replaceState`. (2) Otherwise read the localStorage key `my-next-car:simulation:v1`; if valid, use it. (3) Otherwise use the example scenario. The saved scenario is read from the key `my-next-car:baseline:v1` with the same validation; if missing or invalid there is no saved scenario. Wrap every localStorage and decoding call in `try/catch`; a failure falls through to the next step.

**Persistence.** On every state change, save `JSON.stringify(state)` under `my-next-car:simulation:v1`. Save or remove `my-next-car:baseline:v1` when the saved scenario changes.

**Share link.** `sharing.ts`: the link is `location.origin + location.pathname + "#s=" + encodeURIComponent(JSON.stringify(state))`. Decoding is `JSON.parse(decodeURIComponent(hash.slice(3)))` followed by `parseSimulation`. The saved scenario is not part of the link. The button "Copia link" copies the link with `navigator.clipboard.writeText` and changes its label to "Link copiato" for two seconds; if the clipboard call fails, show the link in a read-only `Input` for manual copying.

**Reset.** The button "Ripristina esempio" asks for confirmation with `window.confirm("Vuoi sostituire i valori attuali con lo scenario di esempio?")`, then loads the example scenario and removes the saved scenario.

**CSV export.** `csv.ts` builds the file; the button downloads it as `my-next-car-confronto.csv` through a `Blob` and a temporary `<a download>` element. Format for Italian spreadsheet software: UTF-8 with BOM, semicolon as separator, line ending `\r\n`, numbers with a **comma** as decimal separator, two decimals, no thousands separator and no currency symbol, text fields wrapped in double quotes with inner quotes doubled. Content, in this order:

1. Block "Dati inseriti": header `Sezione;Campo;Valore`, one line for every field of `SimulationState` except `schemaVersion`, using the Italian labels of section 4.
2. One empty line.
3. Block "Risultati": header `Voce;Contanti;Finanziamento classico;Finanziamento con maxirata;Leasing finanziario`, one line for each of: Da versare subito, Rata mensile, Numero di rate, Pagamento finale, Interessi totali, Spese, Esborso totale, Costo totale, In più rispetto ai contanti, TAN (%), TAEG stimato (%). An invalid method or a not-applicable value is an empty cell.

---

## 15. Things you must not do

- Do not add dark mode, login, cookies banners, analytics, service workers, routing or multiple pages.
- Do not add fields, financing types (for example noleggio a lungo termine) or costs not listed in section 4.
- Do not write real lender names, real offers, current market rates or incentive amounts.
- Do not present the TAEG stimato as official, and do not present the return of the vehicle as available by default.
- Do not label any option "migliore" or "consigliato".
- Do not duplicate a formula outside `src/domain/financing/`.

---

## 16. Tests (Vitest, domain only)

Create the tests below in `src/domain/financing/*.test.ts`. Amounts are written here in euros with English number notation (`35,000.00` means thirty-five thousand euros); in the tests compare integer cents with `toBe` (exact). Rates are compared with a tolerance of ±0.01. Do not write React component tests.

**T1. Standard loan.** `P = 35,000.00`, `B = 0`, `n = 60`, TAN 7.49.
Installment `701.16`; row 1: interest `218.46`, principal `482.70`, balance `34,517.30`; row 2: interest `215.45`, principal `485.71`, balance `34,031.59`; balance after month 12 `29,004.53`; last installment `701.28`; final balance `0`; total interest `7,069.72`; sum of installments `42,069.72`. With no fees the TAEG stimato is `7.75`.

**T2. Small loan.** `P = 10,000.00`, `n = 12`, TAN 6. Installment `860.66`; row 1 interest `50.00`; last installment `860.70`; total interest `327.96`.

**T3. Zero interest.**
(a) `P = 12,000.00`, `n = 24`, TAN 0: installment `500.00`, total interest `0`, final balance `0`.
(b) `P = 10,000.00`, `n = 36`, TAN 0: installment `277.78`, last installment `277.70`, sum of installments `10,000.00`.
(c) Balloon: `P = 20,000.00`, `B = 8,000.00`, `n = 48`, TAN 0: installment `250.00`, final balance `8,000.00`, total interest `0`.

**T4. Balloon loan.** `P = 37,000.00`, `B = 17,477.00`, `n = 60`, TAN 7.49.
Installment `500.19`; row 1: interest `230.94`, principal `269.25`, balance `36,730.75`; balance after month 12 `33,655.77`; last installment `500.50`; final balance `17,477.00`; total interest `10,488.71`; sum of installments `30,011.71`.

**T5. Leasing, calculated mode.** `P = 35,300.00`, `B = 14,669.00`, `n = 60`, TAN 7.49.
Installment `504.86`; row 1 interest `220.33`; last installment `505.11`; final balance `14,669.00`; total interest `9,660.85`.

**T6. Leasing, quoted mode.** `P = 35,300.00`, `B = 14,669.00`, `n = 60`.
(a) Quoted payment `504.86`: implied TAN `7.49`; total interest `9,660.60`; final balance `14,669.00`.
(b) Quoted payment `450.00`: implied TAN `4.98`; total interest `6,369.00`.
(c) Quoted payment `300.00`: the method is invalid (payments total `32,669.00`, less than `P`).

**T7. Rate solver.** `solveMonthlyRate(1000000, Array(12).fill(86066)) * 1200` is `6.00` within ±0.01. Payments whose sum is lower than the amount return `null`. Payments whose sum equals the amount return `0`.

**T8. Acquisition and trade-in.** List price `30,000`, discount `1,500`, scrappage incentive `2,000`, other incentives `500`, additional costs `800`: net purchase price `26,800.00`.
(a) Trade-in value `8,000`, outstanding loan `3,000`: equity `5,000.00`; cash purchase: initial cash `21,800.00`, total cost `26,800.00`, total cash paid `21,800.00`.
(b) Trade-in value `5,000`, outstanding loan `7,500`: equity `-2,500.00`; cash purchase: initial cash `29,300.00`, total cost `26,800.00`.
(c) Same as (b) with a loan: down payment `4,000`, 48 months, TAN 5, upfront fees `200`, monthly fee `2`: principal `25,300.00`; installment `582.64`; last installment `582.70`; total interest `2,666.78`; total fees `296.00`; initial cash `4,200.00`; total cost `29,762.78`; total cash paid `32,262.78`; TAEG stimato `5.72`.

**T9. Full example scenario** (`computeComparison(exampleScenario)`; net purchase price `46,990.00`, equity `0`):

| | Loan | Balloon | Leasing (calculated) |
|---|---|---|---|
| Principal | 36,990.00 | 38,990.00 | 37,290.00 |
| Installment | 741.03 | 540.06 | 544.73 |
| Monthly outflow | 744.03 | 543.06 | 547.73 |
| Last installment | 740.89 | 540.05 | 544.71 |
| Final payment | 0 | 17,477.00 | 14,669.00 |
| Initial cash | 10,300.00 | 8,300.00 | 10,000.00 |
| Total interest | 7,471.66 | 10,890.59 | 10,062.78 |
| Total fees | 480.00 | 480.00 | 480.00 |
| Total cost | 54,941.66 | 58,360.59 | 57,532.78 |
| Extra cost vs cash | 7,951.66 | 11,370.59 | 10,542.78 |
| TAEG stimato | 8.31 | 8.14 | 8.18 |

Cash: total cost `46,990.00`. `lowestCostKinds` is `['cash']`; `lowestCostFinancedKinds` is `['loan']`; `lowestMonthlyKinds` is `['balloon']`; `lowestInitialCashKinds` is `['balloon']`. With `balloon.returnOptionEnabled = true` and `returnFees = 500`, `costIfReturned` is `41,383.59`.

**T10. Invariants.** For every valid financed result in T8(c) and T9: `initialCash + totalInstallments + months * monthlyFee + finalPayment == totalCashPaid`; the sum of the principal column equals `principal - finalPayment`; the last balance equals `finalPayment`.

**T11. Validation.** One test for each row of the tables in section 8, checking that the method (or all methods) is invalid and that the message matches.

**T12. TAEG comparison.** `compareTaeg(8.31, 0)` is `'none'`; `compareTaeg(null, 9)` is `'none'`; `compareTaeg(8.31, 8.40)` is `'aligned'`; `compareTaeg(8.31, 9.20)` is `'higher'`; `compareTaeg(8.31, 7.50)` is `'lower'`.

**T13. Persistence helpers.** `parseSimulation` returns an equal object for the example scenario after a `JSON.stringify` / `JSON.parse` round trip; returns `null` for `null`, for `{}`, for a state with `schemaVersion: 2`, and for a state where `listPrice` is a string. The share-link encode and decode functions round-trip the example scenario, including a vehicle name containing accented characters and a `#`.

---

## 17. Implementation phases and gates

**Phase 1: Financial engine.** Project setup (section 2), types, acquisition, amortization, rate solver, validation, comparison, explanations, sensitivity, and tests T1 to T12.
Gate: `npm run test` passes with all tests green, and `npm run build` succeeds.

**Phase 2: Core interface.** `format.ts`, `strings.ts`, `useSimulation`, InfoTip, the three input steps, the verdict, the "TAN e TAEG in breve" box, the comparison cards, the comparison table, validation messages. Results update on every change.
Gate: `npm run build` succeeds. With the example scenario loaded, the cards show the values of test T9 formatted in Italian (for example `54.941,66 €`).

**Phase 3: Charts.** Charts 1 to 6 inside Tabs, with captions and data tables.
Gate: `npm run build` succeeds. Chart components contain no financial formulas, only reads from `ComparisonResult` and from `sensitivity.ts`.

**Phase 4: Simulation and usability.** Saved scenario with differences on the cards, AnimatedNumber, explanations section, excluded-costs note, glossary, localStorage persistence, share link, reset, CSV export, responsive layout, test T13.
Gate: `npm run test` and `npm run build` succeed.

**Phase 5: Quality and documentation.** Repository files of section 18. Fix every TypeScript error and every build warning. Search your code under `src/` for `any`, `TODO`, `console.log` and for English text visible to the user, and remove them. Check the layout at widths 375px and 1280px.
Gate: `npm run test` and `npm run build` succeed from a clean clone after `npm install`.

If git is available, make one commit at the end of each phase.

---

## 18. Repository files

- `README.md` (in English) with these sections in this order: Project overview; Main features; Screenshots (placeholder text only); Local setup; Development commands; Testing; Build and deployment (Netlify); Financial assumptions; Known limitations; Assumptions made during implementation; Contributing.
  "Financial assumptions" must state: the app targets the Italian market and amounts include VAT; installments are paid monthly in arrears; the final payment is due with the last installment; upfront fees are paid at signing and are not financed; amounts are rounded to the cent and the last installment absorbs rounding; leasing is modelled with the same mathematics as a balloon loan; the TAEG stimato is an estimate based on the entered data and is not the official TAEG of a contract; negative trade-in equity is added to the amount financed.
  "Known limitations" must list the excluded costs of section 1, the absence of tax rules (for example VAT deduction for businesses), and that insurance products bundled with financing are not modelled.
- `LICENSE`: MIT license text.
- `.gitignore`: `node_modules`, `dist`, `.DS_Store`, `*.local`.
- `.editorconfig`: UTF-8, LF line endings, 2-space indentation, final newline.
- `CONTRIBUTING.md`: how to install, run tests, and the rule that financial logic lives only in `src/domain/financing` and must come with tests.
- `netlify.toml`: section 2.
- No `.env` or `.env.example` file: the app has no environment variables.
- No proprietary images, fonts or other assets.

---

## 19. Acceptance checklist

The work is complete only when every item is true:

- [ ] `npm install`, `npm run test` and `npm run build` succeed with no errors and no warnings.
- [ ] All tests of section 16 exist and pass with the expected values unchanged.
- [ ] With the example scenario, verdict, cards, table, charts and CSV all show the values of test T9.
- [ ] Every text visible to the user is in Italian and matches this specification.
- [ ] TAN, TAEG and every other glossary term have an InfoTip wherever they appear; the "TAN e TAEG in breve" box and the "Glossario" section are present.
- [ ] The computed rate is always labelled "TAEG stimato".
- [ ] The verdict shows the four tiles and never uses "migliore" or "consigliato".
- [ ] Changing any input updates verdict, cards, table, charts and explanations immediately, with animated numbers and no submit button.
- [ ] Saving a comparison scenario and then changing an input shows the differences on the cards.
- [ ] Each of the four methods has its own inputs; "Applica a tutti i finanziamenti" copies the shared values.
- [ ] Invalid inputs produce the messages of section 8; `NaN`, `Infinity`, `undefined` and `null` never appear on screen.
- [ ] A 0% TAN, a zero down payment, zero fees and a negative trade-in equity all produce correct results.
- [ ] The return option is off by default and return text appears only when it is switched on.
- [ ] Reloading the page restores the last inputs; a copied link opened in a new browser tab reproduces the same simulation.
- [ ] The CSV file has the structure of section 14.
- [ ] The layout is usable at 375px and at 1280px width, with no horizontal scrolling of the page body.
- [ ] No file outside `src/domain/financing/` contains an amortization, interest or rate formula.
- [ ] The interface is built with shadcn/ui components; files in `src/components/ui/` are unmodified.
- [ ] The README contains all the sections of section 18.

---

## 20. Final report

When everything is done, reply with a short report containing: (1) the output of the final `npm run test` and `npm run build`; (2) the acceptance checklist of section 19 with each item marked done or not done; (3) every assumption you added to the README; (4) anything in this specification that you could not implement as written, and why. Do not claim that a check passed unless you ran it.
