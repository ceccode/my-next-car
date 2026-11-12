import type { SimulationState } from '@/domain/financing/types'
import { withCommonTerms } from '@/domain/scenario/scenario'
import { exampleScenario } from './exampleScenario'

/**
 * What a first-time visitor sees: the example vehicle with the same terms on every
 * financed method, so the three sliders drive all of them from the start.
 */
export const starterScenario: SimulationState = withCommonTerms(exampleScenario, {})
