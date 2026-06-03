import jerusalem from './cities/jerusalem.json'
import london from './cities/london.json'

export const CITIES = [jerusalem, london]

export function getCityById(id) {
  return CITIES.find(c => c.id === id) ?? null
}
