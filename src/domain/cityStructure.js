export const CITY_STRUCTURE_TYPES = {
  1: { label: 'Compact Monocentric', coverageRange: [3, 4] },
  2: { label: 'Extended Monocentric', coverageRange: [5, 7] },
  3: { label: 'Polycentric Connected', coverageRange: [7, 9] },
  4: { label: 'Extreme Polycentric', coverageRange: [9, 10] },
}

export const HARD_CEILING = 10

export function getCoverageRange(cityType) {
  return CITY_STRUCTURE_TYPES[cityType]?.coverageRange ?? [3, 4]
}
