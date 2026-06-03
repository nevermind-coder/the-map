import { describe, it, expect } from 'vitest'
import { applyFilters } from '../engine/applyFilters.js'

function district(authenticity, clubPresence) {
  return { scores: { authenticity, clubPresence } }
}

describe('applyFilters — authenticity (Axis B)', () => {
  it('local + Immersive → +0.7', () => {
    const { adjustment } = applyFilters(district('local', 'none'), 0, -1)
    expect(adjustment).toBeCloseTo(0.7)
  })
  it('mixed + Immersive → +0.1', () => {
    const { adjustment } = applyFilters(district('mixed', 'none'), 0, -1)
    expect(adjustment).toBeCloseTo(0.1)
  })
  it('touristy + Immersive → -0.7', () => {
    const { adjustment } = applyFilters(district('touristy', 'none'), 0, -1)
    expect(adjustment).toBeCloseTo(-0.7)
  })
  it('authenticity has no effect when Axis B = 0 (Mixed)', () => {
    const { adjustment } = applyFilters(district('local', 'none'), 0, 0)
    expect(adjustment).toBe(0)
  })
})

describe('applyFilters — club presence (Axis A)', () => {
  it('heavy + Restorative → hard disqualified', () => {
    const { hardDisqualified } = applyFilters(district('mixed', 'heavy'), -1, 0)
    expect(hardDisqualified).toBe(true)
  })
  it('heavy + Mixed → -0.4', () => {
    const { adjustment, hardDisqualified } = applyFilters(district('mixed', 'heavy'), 0, 0)
    expect(hardDisqualified).toBe(false)
    expect(adjustment).toBeCloseTo(-0.4)
  })
  it('heavy + Stimulating → +0.3', () => {
    const { adjustment } = applyFilters(district('mixed', 'heavy'), 1, 0)
    expect(adjustment).toBeCloseTo(0.3)
  })
  it('some + Restorative → -0.4', () => {
    const { adjustment } = applyFilters(district('mixed', 'some'), -1, 0)
    expect(adjustment).toBeCloseTo(-0.4)
  })
  it('some + Stimulating → +0.1', () => {
    const { adjustment } = applyFilters(district('mixed', 'some'), 1, 0)
    expect(adjustment).toBeCloseTo(0.1)
  })
  it('some + Mixed → 0', () => {
    const { adjustment } = applyFilters(district('mixed', 'some'), 0, 0)
    expect(adjustment).toBe(0)
  })
  it('none club presence has no club effect', () => {
    const { adjustment } = applyFilters(district('mixed', 'none'), 1, 0)
    expect(adjustment).toBe(0)
  })
})
