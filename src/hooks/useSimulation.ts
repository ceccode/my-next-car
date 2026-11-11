import { useEffect, useMemo, useState } from 'react'
import { exampleScenario } from '@/data/exampleScenario'
import { computeComparison } from '@/domain/financing/comparison'
import type { SimulationState } from '@/domain/financing/types'
import { buildShareLink, clearHash, readStateFromHash } from '@/lib/sharing'
import { loadBaseline, loadSimulation, removeBaseline, saveBaseline, saveSimulation } from '@/lib/storage'

function initialState(): SimulationState {
  const fromHash = readStateFromHash()
  if (fromHash) {
    clearHash()
    return fromHash
  }
  return loadSimulation() ?? structuredClone(exampleScenario)
}

const clone = (s: SimulationState): SimulationState => structuredClone(s)

export function useSimulation() {
  const [state, setState] = useState<SimulationState>(initialState)
  const [baseline, setBaseline] = useState<SimulationState | null>(loadBaseline)

  useEffect(() => {
    saveSimulation(state)
  }, [state])

  useEffect(() => {
    if (baseline) saveBaseline(baseline)
    else removeBaseline()
  }, [baseline])

  const result = useMemo(() => computeComparison(state), [state])
  const baselineResult = useMemo(() => (baseline ? computeComparison(baseline) : null), [baseline])
  const isExample = useMemo(() => JSON.stringify(state) === JSON.stringify(exampleScenario), [state])
  const shareLink = useMemo(() => buildShareLink(state), [state])

  const setVehicle = (patch: Partial<SimulationState['vehicle']>) =>
    setState((s) => ({ ...s, vehicle: { ...s.vehicle, ...patch } }))
  const setAcquisition = (patch: Partial<SimulationState['acquisition']>) =>
    setState((s) => ({ ...s, acquisition: { ...s.acquisition, ...patch } }))
  const setShared = (patch: Partial<SimulationState['shared']>) =>
    setState((s) => ({ ...s, shared: { ...s.shared, ...patch } }))
  const setLoan = (patch: Partial<SimulationState['loan']>) =>
    setState((s) => ({ ...s, loan: { ...s.loan, ...patch } }))
  const setBalloon = (patch: Partial<SimulationState['balloon']>) =>
    setState((s) => ({ ...s, balloon: { ...s.balloon, ...patch } }))
  const setLeasing = (patch: Partial<SimulationState['leasing']>) =>
    setState((s) => ({ ...s, leasing: { ...s.leasing, ...patch } }))

  const applySharedToAll = () =>
    setState((s) => ({
      ...s,
      loan: {
        ...s.loan,
        downPayment: s.shared.downPayment,
        months: s.shared.months,
        tanPercent: s.shared.tanPercent,
        upfrontFees: s.shared.upfrontFees,
        monthlyFee: s.shared.monthlyFee,
      },
      balloon: {
        ...s.balloon,
        downPayment: s.shared.downPayment,
        months: s.shared.months,
        tanPercent: s.shared.tanPercent,
        upfrontFees: s.shared.upfrontFees,
        monthlyFee: s.shared.monthlyFee,
      },
      leasing: {
        ...s.leasing,
        initialPayment: s.shared.downPayment,
        months: s.shared.months,
        tanPercent: s.shared.tanPercent,
        upfrontFees: s.shared.upfrontFees,
        monthlyFee: s.shared.monthlyFee,
      },
    }))

  const saveScenario = () => setBaseline(clone(state))
  const updateScenario = () => setBaseline(clone(state))
  const removeScenario = () => setBaseline(null)

  const resetExample = () => {
    setState(structuredClone(exampleScenario))
    setBaseline(null)
  }

  return {
    state,
    result,
    baseline,
    baselineResult,
    isExample,
    shareLink,
    setVehicle,
    setAcquisition,
    setShared,
    setLoan,
    setBalloon,
    setLeasing,
    applySharedToAll,
    saveScenario,
    updateScenario,
    removeScenario,
    resetExample,
  }
}
