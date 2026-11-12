import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { starterScenario } from '@/data/starterScenario'
import { computeComparison } from '@/domain/financing/comparison'
import type { SimulationState } from '@/domain/financing/types'
import { withCommonTerms, withListPrice, type CommonTerms } from '@/domain/scenario/scenario'
import { buildShareLink, clearHash, readStateFromHash } from '@/lib/sharing'
import { loadSimulation, saveSimulation } from '@/lib/storage'

function initialState(): SimulationState {
  const shared = readStateFromHash()
  if (shared) {
    clearHash()
    return shared
  }
  return loadSimulation() ?? structuredClone(starterScenario)
}

type Section<K extends keyof SimulationState> = Partial<SimulationState[K]>

export function useSimulation() {
  const [state, setState] = useState(initialState)
  // Sliders fire many events per second: let React drop stale recalculations.
  const settledState = useDeferredValue(state)

  useEffect(() => saveSimulation(settledState), [settledState])

  const result = useMemo(() => computeComparison(settledState), [settledState])
  const shareLink = useMemo(() => buildShareLink(settledState), [settledState])

  const update = <K extends 'acquisition' | 'loan' | 'balloon' | 'leasing'>(key: K) => (changes: Section<K>) =>
    setState((current) => ({ ...current, [key]: { ...current[key], ...changes } }))

  return {
    state,
    result,
    shareLink,
    setListPrice: (price: number) => setState((current) => withListPrice(current, price)),
    setCommonTerms: (changes: Partial<CommonTerms>) => setState((current) => withCommonTerms(current, changes)),
    setAcquisition: update('acquisition'),
    setLoan: update('loan'),
    setBalloon: update('balloon'),
    setLeasing: update('leasing'),
    reset: () => setState(structuredClone(starterScenario)),
  }
}

export type Simulation = ReturnType<typeof useSimulation>
