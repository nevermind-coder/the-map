// Both desire and behavior must agree on a pole to resolve to that pole.
// Any conflict, middle on either, or both middle → Mixed (0).
// Pole + Pole agree → ±1.

const AXIS_A_POLES = { stimulating: 1, restorative: -1, mixed: 0 }
const AXIS_B_POLES = { immersive: -1, enclaved: 1, mixed: 0 }

export function composeAxisA(desire, behavior) {
  if (desire === 'mixed' || behavior === 'mixed') return 0
  if (desire !== behavior) return 0
  return AXIS_A_POLES[desire] ?? 0
}

export function composeAxisB(desire, behavior) {
  if (desire === 'mixed' || behavior === 'mixed') return 0
  if (desire !== behavior) return 0
  return AXIS_B_POLES[desire] ?? 0
}

export function computeQ6Weights(q6) {
  const allValueTypes = [
    'historic_cultural', 'gastronomic', 'beach_coastal',
    'nightlife', 'local_commerce', 'nature', 'scenic_routes',
  ]
  const weights = {}

  if (!q6 || q6.allOfIt || !q6.ranked || q6.ranked.length === 0) {
    allValueTypes.forEach(vt => { weights[vt] = 0.5 })
    return weights
  }

  allValueTypes.forEach(vt => { weights[vt] = 0.1 })
  q6.ranked.forEach((vtId, idx) => {
    weights[vtId] = idx === 0 ? 1.0 : 0.5
  })

  return weights
}
