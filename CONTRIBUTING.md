# Contributing

## Getting started

1. Install Node.js 22 or later.
2. Run `npm install`.
3. Run `npm run dev` for the dev server, `npm test` for the tests.

## How we work

- **Logic first, in plain functions, with a test.** Anything that decides something (a calculation, a ranking, a rule about input) goes in `src/domain/` or `src/lib/`, next to a `*.test.ts`. Write the test first when you can.
- **Components render, they do not decide.** If a component grows an `if` about money, move it into a function and test that.
- **Financial logic lives only in `src/domain/financing/`.** Do not change the expected values of existing engine tests; add new ones.
- **All visible copy is Italian and lives in `src/lib/strings.ts`.** Plain words, second person, no jargon without an explanation.
- **Small steps.** Each commit should leave the tests green and do one thing.
- **Mobile first.** Check every change at 360 and 390 pixels wide. Touch targets stay at least 44px.
- Before opening a pull request, `npm test`, `npm run lint` and `npm run build` must pass with no warnings.
