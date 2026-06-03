import { COEFFICIENT_TABLE, WEIGHTED_CRITERIA } from '../domain/criteria.js'

export function computeWeights(axisA, axisB) {
  const rawWeights = {}
  let total = 0

  for (const criterion of WEIGHTED_CRITERIA) {
    const { base, a, b } = COEFFICIENT_TABLE[criterion]
    const raw = Math.max(1, base + axisA * a + axisB * b)
    rawWeights[criterion] = raw
    total += raw
  }

  const normalized = {}
  for (const criterion of WEIGHTED_CRITERIA) {
    normalized[criterion] = rawWeights[criterion] / total
  }

  return normalized
}
