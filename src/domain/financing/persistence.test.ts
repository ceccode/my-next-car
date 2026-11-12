import { describe, expect, it } from 'vitest'
import { exampleScenario } from '@/data/exampleScenario'
import { encodeShareHash, parseShareHash } from '@/lib/sharing'
import { parseSimulation } from '@/lib/storage'
import type { SimulationState } from './types'

function clone(): SimulationState {
  return JSON.parse(JSON.stringify(exampleScenario)) as SimulationState
}

describe('T13. Persistence helpers', () => {
  it('parseSimulation returns an equal object after a JSON round trip of the example scenario', () => {
    const parsed = parseSimulation(JSON.parse(JSON.stringify(exampleScenario)))
    expect(parsed).toEqual(exampleScenario)
  })

  it('parseSimulation returns null for null', () => {
    expect(parseSimulation(null)).toBeNull()
  })

  it('parseSimulation returns null for an empty object', () => {
    expect(parseSimulation({})).toBeNull()
  })

  it('parseSimulation returns null for schemaVersion 2', () => {
    const s = clone()
    s.schemaVersion = 2 as 1
    expect(parseSimulation(s)).toBeNull()
  })

  it('parseSimulation returns null when listPrice is a string', () => {
    const s = clone()
    s.acquisition.listPrice = '46990' as unknown as number
    expect(parseSimulation(s)).toBeNull()
  })

  it('share link encode and decode round-trip the example scenario', () => {
    const s = clone()
    expect(parseShareHash(encodeShareHash(s))).toEqual(s)
  })

  it('share link encode and decode round-trip a vehicle name with accents and a #', () => {
    const s = clone()
    s.vehicle.name = 'Fiat 500 #Édition Spéciale'
    expect(parseShareHash(encodeShareHash(s))).toEqual(s)
  })
})
