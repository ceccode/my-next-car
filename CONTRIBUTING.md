# Contributing

## Getting started

1. Install Node.js 20 or later.
2. Run `npm install`.
3. Run `npm run dev` to start the development server, or `npm run test` to run the test suite.

## Rules

- All user-visible text is in Italian and lives in `src/lib/strings.ts`.
- All financial logic (acquisition math, amortization, rate solving, validation, comparison, explanations, sensitivity) lives only in `src/domain/financing/`.
- Every change to financial logic in `src/domain/financing/` must come with tests in `src/domain/financing/*.test.ts`, and the expected values of the existing tests must not be changed.
- Run `npm run test` and `npm run build` before submitting changes; both must pass with no warnings.
