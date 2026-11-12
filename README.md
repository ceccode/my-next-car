# My Next Car

## Project overview

My Next Car is a frontend-only single-page application for the Italian market that compares four ways of paying for the same vehicle: cash (contanti), traditional loan (finanziamento classico), balloon loan (finanziamento con maxirata) and financial leasing (leasing finanziario). It works for any vehicle that has a purchase price (car, motorcycle, van, new or used).

The app has two goals:

1. Help the user understand which option is more convenient, given what matters to them: lowest total cost, lowest monthly payment, or lowest cash needed today.
2. Let the user run simulations: change a value and immediately see how payments, interest and total cost change, and compare against a saved scenario.

There is no backend, no database and no external API. All data lives in the browser (localStorage and the URL hash for sharing).

## Main features

- Three-step input: vehicle and acquisition, optional trade-in, financing offers (shared values plus one form per method).
- Immediate results on every change: verdict ("Cosa conviene"), comparison cards, six charts, detailed comparison table and plain-language explanations.
- Plain-Italian explanations of every financial term (InfoTips, "TAN e TAEG in breve" box, glossary).
- Estimated TAEG (TAEG stimato) for each financed method, compared with the TAEG of the quote when provided.
- Optional return option for balloon and leasing, off by default.
- Saved comparison scenario with per-card differences.
- Six charts with data tables: total cost, cash timing, residual debt, interest vs principal per month, cumulative outflows, and a what-if sensitivity chart.
- CSV export formatted for Italian spreadsheet software.
- Shareable link (simulation state encoded in the URL hash), localStorage persistence, one-click reset to the example scenario.
- Italian (it-IT) number and currency formatting, amounts in EUR including VAT.

## Screenshots

_Screenshots to be added._

## Local setup

Prerequisites: Node.js 20 or later.

```bash
npm install
npm run dev
```

The app is then served at the local Vite dev URL shown in the terminal.

## Development commands

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start the Vite development server        |
| `npm run build`   | Type-check (tsc) and build for production |
| `npm run preview` | Preview the production build locally     |
| `npm run test`    | Run the Vitest test suite                |
| `npm run lint`    | Run oxlint                               |

## Testing

Tests are written in Vitest and cover the financial domain only (`src/domain/financing/*.test.ts`): amortization, rate solving, acquisition math, validation, comparison, explanations, sensitivity and persistence helpers. They compare integer cents exactly and rates with a tolerance of ±0.01. Run them with `npm run test`.

## Build and deployment (Netlify)

The repository ships a `netlify.toml`: build command `npm run build`, publish directory `dist`, Node 22, and a SPA redirect. Connect the repository to Netlify and it deploys as-is, or deploy the `dist` folder to any static host.

## Financial assumptions

- The app targets the Italian market and all amounts include VAT (IVA inclusa).
- Installments are paid monthly in arrears.
- The final payment (maxirata or riscatto) is due with the last installment.
- Upfront fees are paid at signing and are not financed.
- Amounts are rounded to the cent and the last installment absorbs rounding.
- Leasing is modelled with the same mathematics as a balloon loan.
- The TAEG stimato is an estimate based on the entered data and is not the official TAEG of a contract.
- Negative trade-in equity is added to the amount financed.

## Known limitations

The comparison covers purchase and financing cost only. The following are out of scope:

- Fuel, electricity, insurance, maintenance, road tax (bollo auto), parking, tolls, depreciation, resale value, investment returns, opportunity cost and inflation.
- Tax rules (for example VAT deduction for businesses).
- Insurance products bundled with financing.

The app never suggests incentive amounts, market rates or real offers: incentives and rates are typed in by the user.

## Assumptions made during implementation

- When the estimated TAEG equals the quoted TAEG within the comparison tolerance, the card text says the quote "è in linea con il TAEG stimato" (see `TAEG_COMPARISON.aligned` in `src/lib/strings.ts`).
- For the cash method with a negative "da versare subito" (trade-in equity higher than the price), the explanations use the absolute value of the amount received.
- The CSV export writes each block name ("Dati inseriti", "Risultati") as a title line above its header row.
- The "Spese" row of the comparison table explains the term with the glossary entry "Spese iniziali".
- Chart 1 and chart 2 use the fixed palette of the spec: blue for net price / amount at signing, amber for interest / monthly installments, gray for fees / final payment; line charts add distinct dash patterns so color is never the only differentiator.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: user-visible text lives in `src/lib/strings.ts`, all financial logic lives only in `src/domain/financing/` with tests, and `npm run test` plus `npm run build` must pass before submitting changes.
