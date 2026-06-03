import { describe, it, expect } from 'vitest'
import { rankDistricts } from '../engine/rankDistricts.js'
import { computeWeights } from '../engine/composition.js'

function makeDistrict(id, overrides = {}) {
  return {
    id,
    valueTypesPresent: [],
    scores: {
      daytimeLife: 7,
      eveningLife: 6,
      clubPresence: 'none',
      proximityToAttractions: 7,
      strategicLocation: 7,
      pedestrianComfort: 7,
      transportConnections: 7,
      priceLevel: 7,
      authenticity: 'mixed',
      safety: 'safe',
      ...overrides,
    },
  }
}

const TYPOLOGY = 'polycentric_walkable'
const Q6 = { ranked: [], allOfIt: false }

describe('rankDistricts', () => {
  it('hard crime district is excluded (score = -Infinity, placed last)', () => {
    const districts = [
      makeDistrict('safe-one'),
      makeDistrict('dangerous', { safety: 'hard_crime' }),
    ]
    const weights = computeWeights(0, 0)
    const result = rankDistricts(districts, weights, 0, 0, TYPOLOGY, Q6)
    expect(result[result.length - 1].district.id).toBe('dangerous')
    expect(result[result.length - 1].hardDisqualified).toBe(true)
  })

  it('heavy clubs + Restorative → hard disqualified', () => {
    const districts = [
      makeDistrict('quiet'),
      makeDistrict('clubby', { clubPresence: 'heavy' }),
    ]
    const weights = computeWeights(-1, 0)
    const result = rankDistricts(districts, weights, -1, 0, TYPOLOGY, Q6)
    const clubby = result.find(r => r.district.id === 'clubby')
    expect(clubby.hardDisqualified).toBe(true)
  })

  it('heavy clubs + Stimulating → not disqualified and gets bonus', () => {
    const districts = [
      makeDistrict('baseline'),
      makeDistrict('clubby', { clubPresence: 'heavy' }),
    ]
    const weights = computeWeights(1, 0)
    const result = rankDistricts(districts, weights, 1, 0, TYPOLOGY, Q6)
    const clubby = result.find(r => r.district.id === 'clubby')
    expect(clubby.hardDisqualified).toBe(false)
    expect(clubby.score).toBeGreaterThan(result.find(r => r.district.id === 'baseline').score)
  })

  it('local + Immersive gets authenticity bonus over touristy', () => {
    const districts = [
      makeDistrict('local-d', { authenticity: 'local' }),
      makeDistrict('touristy-d', { authenticity: 'touristy' }),
    ]
    const weights = computeWeights(0, -1)
    const result = rankDistricts(districts, weights, 0, -1, TYPOLOGY, Q6)
    expect(result[0].district.id).toBe('local-d')
  })

  it('returns all districts ranked by score descending (excluding disqualified)', () => {
    const districts = [
      makeDistrict('low', { daytimeLife: 3, eveningLife: 3 }),
      makeDistrict('high', { daytimeLife: 9, eveningLife: 9 }),
      makeDistrict('mid', { daytimeLife: 6, eveningLife: 6 }),
    ]
    const weights = computeWeights(1, 0)
    const result = rankDistricts(districts, weights, 1, 0, TYPOLOGY, Q6)
    const ids = result.filter(r => !r.hardDisqualified).map(r => r.district.id)
    expect(ids[0]).toBe('high')
    expect(ids[ids.length - 1]).toBe('low')
  })
})
