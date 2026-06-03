import { describe, it, expect } from 'vitest'
import { applyCarDependentOverride } from '../engine/applyCarDependentOverride.js'
import { computeWeights } from '../engine/composition.js'
import { WEIGHTED_CRITERIA, CRITERIA } from '../domain/criteria.js'
import { CAR_DEPENDENT_TRANSPORT_CAP } from '../domain/cityTypologyGate.js'

const CELLS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],  [0, 0],  [0, 1],
  [1, -1],  [1, 0],  [1, 1],
]

describe('applyCarDependentOverride', () => {
  it.each(CELLS)('total still sums to 1.0 for axisA=%i axisB=%i', (axisA, axisB) => {
    const weights = computeWeights(axisA, axisB)
    const overridden = applyCarDependentOverride(weights)
    const total = WEIGHTED_CRITERIA.reduce((sum, c) => sum + overridden[c], 0)
    expect(total).toBeCloseTo(1.0, 10)
  })

  it.each(CELLS)('transport capped at 7% for axisA=%i axisB=%i', (axisA, axisB) => {
    const weights = computeWeights(axisA, axisB)
    const overridden = applyCarDependentOverride(weights)
    expect(overridden[CRITERIA.TRANSPORT]).toBeLessThanOrEqual(CAR_DEPENDENT_TRANSPORT_CAP + 1e-10)
  })

  it('all weights remain positive after override', () => {
    for (const [axisA, axisB] of CELLS) {
      const weights = computeWeights(axisA, axisB)
      const overridden = applyCarDependentOverride(weights)
      for (const c of WEIGHTED_CRITERIA) {
        expect(overridden[c]).toBeGreaterThan(0)
      }
    }
  })

  it('is a no-op when transport already below cap', () => {
    const alreadyLow = {}
    WEIGHTED_CRITERIA.forEach(c => { alreadyLow[c] = 1 / WEIGHTED_CRITERIA.length })
    alreadyLow[CRITERIA.TRANSPORT] = 0.03
    const total = WEIGHTED_CRITERIA.reduce((s, c) => s + alreadyLow[c], 0)
    // normalize
    WEIGHTED_CRITERIA.forEach(c => { alreadyLow[c] /= total })
    const result = applyCarDependentOverride(alreadyLow)
    expect(result[CRITERIA.TRANSPORT]).toBeCloseTo(alreadyLow[CRITERIA.TRANSPORT], 10)
  })
})
