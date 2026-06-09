import jerusalem from './cities/jerusalem.json'
import london from './cities/london.json'

const STATIC_CITIES = [jerusalem, london]
const CACHE_KEY = 'the-map-generated-cities'

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}') } catch { return {} }
}

export function cacheCity(city) {
  const cache = readCache()
  cache[city.id] = city
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

export function getAllCities() {
  return [...STATIC_CITIES, ...Object.values(readCache())]
}

// kept for backwards compatibility
export const CITIES = STATIC_CITIES

export function getCityById(id) {
  return STATIC_CITIES.find(c => c.id === id) ?? readCache()[id] ?? null
}
