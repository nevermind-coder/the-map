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
  { id: 'history', label: 'History & culture', emoji: '🏛', description: 'Historic sites, monuments, UNESCO heritage areas, museums, and architectural landmarks' },
  { id: 'food', label: 'Food', emoji: '🍽', description: 'Local restaurants, food markets, street food scenes, and culinary cultural experiences' },
  { id: 'beach', label: 'Beach', emoji: '🏖', description: 'Coastal access, beaches, waterfront promenades, and seaside attractions' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🎭', description: 'Bars, clubs, live music venues, and late-night entertainment scenes' },
  { id: 'markets', label: 'Local markets', emoji: '🛍', description: 'Street markets, bazaars, independent shops, and local artisan goods' },
  { id: 'nature', label: 'Nature', emoji: '🌿', description: 'Parks, green spaces, forests, hiking trails, and natural landscapes' },
  { id: 'views', label: 'Scenic & Historic Routes', emoji: '🏔', description: 'Scenic promenades, panoramic viewpoints, historic walking corridors, and iconic city routes' },
]
