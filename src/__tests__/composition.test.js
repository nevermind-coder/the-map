import { describe, it, expect } from 'vitest'
import { computeWeights } from '../engine/composition.js'
import { WEIGHTED_CRITERIA } from '../domain/criteria.js'

const CELLS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],  [0, 0],  [0, 1],
  [1, -1],  [1, 0],  [1, 1],
]

describe('computeWeights', () => {
  it.each(CELLS)('weights sum to 1.0 for axisA=%i axisB=%i', (axisA, axisB) => {
    const weights = computeWeights(axisA, axisB)
    const total = WEIGHTED_CRITERIA.reduce((sum, c) => sum + weights[c], 0)
    expect(total).toBeCloseTo(1.0, 10)
  })

  it('all weights are positive', () => {
    for (const [axisA, axisB] of CELLS) {
      const weights = computeWeights(axisA, axisB)
      for (const c of WEIGHTED_CRITERIA) {
        expect(weights[c]).toBeGreaterThan(0)
      }
    }
  })

  it('Stimulating profile raises evening life weight vs Restorative', () => {
    const stimulating = computeWeights(1, 0)
    const restorative = computeWeights(-1, 0)
    expect(stimulating.eveningLife).toBeGreaterThan(restorative.eveningLife)
  })

  it('Restorative profile raises pedestrian comfort weight vs Stimulating', () => {
    const restorative = computeWeights(-1, 0)
    const stimulating = computeWeights(1, 0)
    expect(restorative.pedestrianComfort).toBeGreaterThan(stimulating.pedestrianComfort)
  })
})
