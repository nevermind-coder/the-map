import { WEIGHTED_CRITERIA, CRITERIA } from '../domain/criteria.js'
import { applyFilters } from './applyFilters.js'
import { applyCarDependentOverride } from './applyCarDependentOverride.js'
import { isCarDependent } from '../domain/cityTypologyGate.js'
import { computeQ6Weights } from '../profile/composeAxis.js'

function deriveQuietFamilyFriendly(scores) {
  return (
    scores.eveningLife < 9 &&
    scores.clubPresence === 'none' &&
    scores.safety !== 'hard_crime' &&
    scores.pedestrianComfort >= 5
  )
}

function adjustedStrategicScore(district, q6Weights) {
  const base = district.scores.strategicLocation
  let bonus = 0
  for (const vt of district.valueTypesPresent) {
    bonus += (q6Weights[vt] ?? 0.1) * 0.4
  }
  return Math.min(10, base + Math.min(2, bonus))
}

export function rankDistricts(districts, weights, axisA, axisB, cityTypology, q6) {
  const effectiveWeights = isCarDependent(cityTypology)
    ? applyCarDependentOverride(weights)
    : weights

  const q6Weights = computeQ6Weights(q6)

  const scored = districts.map(district => {
    if (district.scores.safety === 'hard_crime') {
      return { district, score: -Infinity, hardDisqualified: true, reason: 'hard_crime' }
    }

    const { adjustment, hardDisqualified } = applyFilters(district, axisA, axisB)

    if (hardDisqualified) {
      return { district, score: -Infinity, hardDisqualified: true, reason: 'clubs_restorative' }
    }

    let weightedScore = 0
    for (const criterion of WEIGHTED_CRITERIA) {
      const score = criterion === CRITERIA.STRATEGIC_LOCATION
        ? adjustedStrategicScore(district, q6Weights)
        : district.scores[criterion]
      weightedScore += score * effectiveWeights[criterion]
    }

    const finalScore = weightedScore + adjustment
    const quietFamilyFriendly = deriveQuietFamilyFriendly(district.scores)

    return {
      district: { ...district, derived: { quietFamilyFriendly } },
      score: finalScore,
      hardDisqualified: false,
      reason: null,
    }
  })

  scored.sort((a, b) => {
    if (a.hardDisqualified && b.hardDisqualified) return 0
    if (a.hardDisqualified) return 1
    if (b.hardDisqualified) return -1
    return b.score - a.score
  })

  return scored
}
