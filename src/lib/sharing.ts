import type { SimulationState } from '@/domain/financing/types'
import { parseSimulation } from './storage'

export function buildShareLink(state: SimulationState): string {
  return location.origin + location.pathname + '#s=' + encodeURIComponent(JSON.stringify(state))
}

export function parseShareHash(hash: string): SimulationState | null {
  if (!hash.startsWith('#s=')) return null
  try {
    return parseSimulation(JSON.parse(decodeURIComponent(hash.slice(3))))
  } catch {
    return null
  }
}

export function readStateFromHash(): SimulationState | null {
  try {
    return parseShareHash(window.location.hash)
  } catch {
    return null
  }
}

export function clearHash(): void {
  try {
    window.history.replaceState(null, '', location.pathname + location.search)
  } catch {
    // ignore
  }
}
