export const VALUE_TYPES = {
  UNKNOWN: 'unknown',
  HISTORIC_CULTURAL: 'historic_cultural',
  GASTRONOMIC: 'gastronomic',
  NATURE: 'nature',
  BEACH_COASTAL: 'beach_coastal',
  NIGHTLIFE: 'nightlife',
  LOCAL_COMMERCE: 'local_commerce',
  SCENIC_ROUTES: 'scenic_routes',
}

export const VALUE_TYPE_LABELS = {
  [VALUE_TYPES.UNKNOWN]: 'Unknown',
  [VALUE_TYPES.HISTORIC_CULTURAL]: 'Historic / Cultural Core',
  [VALUE_TYPES.GASTRONOMIC]: 'Gastronomic Hub',
  [VALUE_TYPES.NATURE]: 'Nature & Breathing Space',
  [VALUE_TYPES.BEACH_COASTAL]: 'Beach / Coastal',
  [VALUE_TYPES.NIGHTLIFE]: 'Nightlife & Entertainment Zone',
  [VALUE_TYPES.LOCAL_COMMERCE]: 'Local Commerce & Market Zone',
  [VALUE_TYPES.SCENIC_ROUTES]: 'Scenic / Historic Routes & Corridors',
}

// Maps Q6 UI labels to value type keys
export const Q6_VALUE_TYPE_MAP = {
  history: VALUE_TYPES.HISTORIC_CULTURAL,
  food: VALUE_TYPES.GASTRONOMIC,
  beach: VALUE_TYPES.BEACH_COASTAL,
  nightlife: VALUE_TYPES.NIGHTLIFE,
  markets: VALUE_TYPES.LOCAL_COMMERCE,
  nature: VALUE_TYPES.NATURE,
  views: VALUE_TYPES.SCENIC_ROUTES,
}

export const Q6_OPTIONS = [
  { id: 'history', label: 'History & culture', emoji: '🏛' },
  { id: 'food', label: 'Food', emoji: '🍽' },
  { id: 'beach', label: 'Beach', emoji: '🏖' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🎭' },
  { id: 'markets', label: 'Local markets', emoji: '🛍' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'views', label: 'Views', emoji: '🏔' },
]
