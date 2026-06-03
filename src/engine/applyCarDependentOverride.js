import { CRITERIA, WEIGHTED_CRITERIA } from '../domain/criteria.js'
import { CAR_DEPENDENT_TRANSPORT_CAP } from '../domain/cityTypologyGate.js'

export function applyCarDependentOverride(weights) {
  const transportWeight = weights[CRITERIA.TRANSPORT]
  const cap = CAR_DEPENDENT_TRANSPORT_CAP

  if (transportWeight <= cap) return { ...weights }

  const excess = transportWeight - cap
  const otherCriteria = WEIGHTED_CRITERIA.filter(c => c !== CRITERIA.TRANSPORT)
  const otherTotal = otherCriteria.reduce((sum, c) => sum + weights[c], 0)

  const adjusted = { ...weights }
  adjusted[CRITERIA.TRANSPORT] = cap

  for (const criterion of otherCriteria) {
    adjusted[criterion] = weights[criterion] + excess * (weights[criterion] / otherTotal)
  }

  return adjusted
}
