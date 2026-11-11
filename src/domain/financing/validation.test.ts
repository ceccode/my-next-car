import { describe, expect, it } from 'vitest'
import { computeComparison } from './comparison'
import { exampleScenario } from '@/data/exampleScenario'
import type { MethodInvalid, MethodKind, SimulationState } from './types'

function base(): SimulationState {
  return JSON.parse(JSON.stringify(exampleScenario)) as SimulationState
}

function expectInvalid(result: ReturnType<typeof computeComparison>, kind: MethodKind, message: string) {
  const m = result[kind]
  if (m.valid) throw new Error(`${kind} should be invalid`)
  const invalid = m as MethodInvalid
  expect(invalid.errors).toContain(message)
}

function expectValid(result: ReturnType<typeof computeComparison>, kind: MethodKind) {
  expect(result[kind].valid).toBe(true)
}

describe('T11. Validation', () => {
  it('global: list price zero or less', () => {
    const s = base()
    s.acquisition.listPrice = 0
    const result = computeComparison(s)
    for (const kind of ['cash', 'loan', 'balloon', 'leasing'] as const) {
      expectInvalid(result, kind, "Inserisci un prezzo del veicolo maggiore di zero.")
    }
  })

  it('global: incentives exceed the price', () => {
    const s = base()
    s.acquisition.discount = 50000
    const result = computeComparison(s)
    for (const kind of ['cash', 'loan', 'balloon', 'leasing'] as const) {
      expectInvalid(result, kind, "Sconti e incentivi superano il prezzo del veicolo.")
    }
  })

  it('global: negative money input', () => {
    const s = base()
    s.acquisition.discount = -100
    const result = computeComparison(s)
    for (const kind of ['cash', 'loan', 'balloon', 'leasing'] as const) {
      expectInvalid(result, kind, "Gli importi non possono essere negativi.")
    }
  })

  it('global: non-finite money input', () => {
    const s = base()
    s.acquisition.discount = Number.NaN
    const result = computeComparison(s)
    for (const kind of ['cash', 'loan', 'balloon', 'leasing'] as const) {
      expectInvalid(result, kind, "Gli importi non possono essere negativi.")
    }
  })

  it('method: months outside 6..120', () => {
    const s = base()
    s.loan.months = 5
    const result = computeComparison(s)
    expectInvalid(result, 'loan', "La durata deve essere compresa tra 6 e 120 mesi.")
    expectValid(result, 'cash')
    expectValid(result, 'balloon')
  })

  it('method: non-integer months', () => {
    const s = base()
    s.loan.months = 60.5
    const result = computeComparison(s)
    expectInvalid(result, 'loan', "La durata deve essere compresa tra 6 e 120 mesi.")
  })

  it('method: TAN outside 0..30', () => {
    const s = base()
    s.loan.tanPercent = 31
    const result = computeComparison(s)
    expectInvalid(result, 'loan', 'Il TAN deve essere compreso tra 0% e 30%.')
    expectValid(result, 'cash')
  })

  it('method: down payment and trade-in exceed the price', () => {
    const s = base()
    s.loan.downPayment = 60000
    const result = computeComparison(s)
    expectInvalid(result, 'loan', "Anticipo e permuta superano il prezzo: non c'è nulla da finanziare.")
  })

  it('method: amount to finance is zero', () => {
    const s = base()
    s.loan.downPayment = 46990
    const result = computeComparison(s)
    expectInvalid(result, 'loan', "L'importo da finanziare è zero: si tratta di un acquisto in contanti.")
  })

  it('method: final payment greater than principal (balloon)', () => {
    const s = base()
    s.balloon.balloonPayment = 60000
    const result = computeComparison(s)
    expectInvalid(result, 'balloon', 'Il pagamento finale non può superare l\'importo finanziato.')
    expectValid(result, 'loan')
  })

  it('method: final payment greater than principal (leasing)', () => {
    const s = base()
    s.leasing.buyout = 60000
    const result = computeComparison(s)
    expectInvalid(result, 'leasing', 'Il pagamento finale non può superare l\'importo finanziato.')
  })

  it('method: quoted monthly payment zero (leasing quoted mode)', () => {
    const s = base()
    s.leasing.mode = 'quoted'
    s.leasing.quotedMonthlyPayment = 0
    const result = computeComparison(s)
    expectInvalid(result, 'leasing', 'Inserisci il canone mensile del preventivo.')
  })

  it('method: quoted payments lower than principal (leasing quoted mode)', () => {
    const s = base()
    s.leasing.mode = 'quoted'
    s.leasing.quotedMonthlyPayment = 100
    const result = computeComparison(s)
    expectInvalid(
      result,
      'leasing',
      "I pagamenti del preventivo sono inferiori all'importo finanziato. Controlla canone mensile, anticipo e riscatto.",
    )
  })
})
