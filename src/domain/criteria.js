export const CRITERIA = {
  DAYTIME_LIFE: 'daytimeLife',
  EVENING_LIFE: 'eveningLife',
  CLUB_PRESENCE: 'clubPresence',
  PROXIMITY: 'proximityToAttractions',
  STRATEGIC_LOCATION: 'strategicLocation',
  PEDESTRIAN_COMFORT: 'pedestrianComfort',
  TRANSPORT: 'transportConnections',
  PRICE_LEVEL: 'priceLevel',
  AUTHENTICITY: 'authenticity',
  SAFETY: 'safety',
  QUIET_FAMILY: 'quietFamilyFriendly',
}

export const CRITERIA_LABELS = {
  [CRITERIA.DAYTIME_LIFE]: 'Daytime Life',
  [CRITERIA.EVENING_LIFE]: 'Evening Life',
  [CRITERIA.CLUB_PRESENCE]: 'Club Presence',
  [CRITERIA.PROXIMITY]: 'Proximity to Attractions',
  [CRITERIA.STRATEGIC_LOCATION]: 'Strategic Location',
  [CRITERIA.PEDESTRIAN_COMFORT]: 'Pedestrian Comfort',
  [CRITERIA.TRANSPORT]: 'Transport Connections',
  [CRITERIA.PRICE_LEVEL]: 'Price Level',
  [CRITERIA.AUTHENTICITY]: 'Authenticity',
  [CRITERIA.SAFETY]: 'Safety',
  [CRITERIA.QUIET_FAMILY]: 'Quiet / Family-Friendly',
}

// The 7 criteria that feed the weighted scoring formula
export const WEIGHTED_CRITERIA = [
  CRITERIA.DAYTIME_LIFE,
  CRITERIA.EVENING_LIFE,
  CRITERIA.PROXIMITY,
  CRITERIA.STRATEGIC_LOCATION,
  CRITERIA.PEDESTRIAN_COMFORT,
  CRITERIA.TRANSPORT,
  CRITERIA.PRICE_LEVEL,
]

// Base weights and axis coefficients per criterion
export const COEFFICIENT_TABLE = {
  [CRITERIA.DAYTIME_LIFE]:       { base: 17, a: +4, b: +2 },
  [CRITERIA.EVENING_LIFE]:       { base: 13, a: +6, b: +1 },
  [CRITERIA.PROXIMITY]:          { base: 13, a: -1, b: +5 },
  [CRITERIA.STRATEGIC_LOCATION]: { base: 20, a: +2, b: +5 },
  [CRITERIA.PEDESTRIAN_COMFORT]: { base: 14, a: -4, b: +2 },
  [CRITERIA.TRANSPORT]:          { base: 12, a: +2, b: +3 },
  [CRITERIA.PRICE_LEVEL]:        { base: 11, a: -2, b: -5 },
}
