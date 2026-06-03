import { describe, it, expect } from 'vitest'
import { projectPersona, getCell } from '../engine/personaProjection.js'

describe('getCell', () => {
  it('(-1,-1) → RI', () => expect(getCell(-1, -1)).toBe('RI'))
  it('(-1, 0) → RM', () => expect(getCell(-1, 0)).toBe('RM'))
  it('(-1,+1) → RE', () => expect(getCell(-1, 1)).toBe('RE'))
  it('( 0,-1) → MI', () => expect(getCell(0, -1)).toBe('MI'))
  it('( 0, 0) → MM', () => expect(getCell(0, 0)).toBe('MM'))
  it('( 0,+1) → ME', () => expect(getCell(0, 1)).toBe('ME'))
  it('(+1,-1) → SI', () => expect(getCell(1, -1)).toBe('SI'))
  it('(+1, 0) → SM', () => expect(getCell(1, 0)).toBe('SM'))
  it('(+1,+1) → SE', () => expect(getCell(1, 1)).toBe('SE'))
})

describe('projectPersona', () => {
  it('RI → Nester', () => expect(projectPersona(-1, -1).persona).toBe('Nester'))
  it('RM → Restorer', () => expect(projectPersona(-1, 0).persona).toBe('Restorer'))
  it('RE → Cartographer (weak fit)', () => {
    const result = projectPersona(-1, 1)
    expect(result.persona).toBe('Cartographer')
    expect(result.isWeakFit).toBe(true)
  })
  it('MI → Wanderer', () => expect(projectPersona(0, -1).persona).toBe('Wanderer'))
  it('MM → Cartographer', () => expect(projectPersona(0, 0).persona).toBe('Cartographer'))
  it('ME → Cartographer', () => expect(projectPersona(0, 1).persona).toBe('Cartographer'))
  it('SI → Atmosphere Chaser', () => expect(projectPersona(1, -1).persona).toBe('Atmosphere Chaser'))
  it('SM → Connoisseur', () => expect(projectPersona(1, 0).persona).toBe('Connoisseur'))
  it('SE → Energizer', () => expect(projectPersona(1, 1).persona).toBe('Energizer'))
  it('only RE is weak fit', () => {
    const cells = [[-1,-1],[-1,0],[0,-1],[0,0],[0,1],[1,-1],[1,0],[1,1]]
    cells.forEach(([a, b]) => expect(projectPersona(a, b).isWeakFit).toBe(false))
  })
})
