const CELL_TO_PERSONA = {
  RI: 'Nester',
  RM: 'Restorer',
  RE: 'Cartographer',
  MI: 'Wanderer',
  MM: 'Cartographer',
  ME: 'Cartographer',
  SI: 'Atmosphere Chaser',
  SM: 'Connoisseur',
  SE: 'Energizer',
}

export function getCell(axisA, axisB) {
  const aLabel = axisA === -1 ? 'R' : axisA === 0 ? 'M' : 'S'
  const bLabel = axisB === -1 ? 'I' : axisB === 0 ? 'M' : 'E'
  return `${aLabel}${bLabel}`
}

export function projectPersona(axisA, axisB) {
  const cell = getCell(axisA, axisB)
  return {
    cell,
    persona: CELL_TO_PERSONA[cell] ?? 'Cartographer',
    isWeakFit: cell === 'RE',
  }
}

export const PERSONA_DESCRIPTIONS = {
  'Nester': 'You want to feel rooted — a quiet local base you return to each evening.',
  'Restorer': 'You recharge in calm, curated spaces away from the tourist flow.',
  'Cartographer': 'You want a strategic perch: well-placed, well-connected, efficient.',
  'Wanderer': 'You want to get lost in local life — discovery over itinerary.',
  'Atmosphere Chaser': 'You chase the energy of the city but want it to feel real, not staged.',
  'Connoisseur': 'You want the best of everything — great food, energy, and taste.',
  'Energizer': 'You want maximum stimulation: buzzing streets, late nights, no FOMO.',
}
