import { describe, it, expect } from 'vitest'
import { composeAxisA, composeAxisB } from '../profile/composeAxis.js'

describe('composeAxisA — full truth table', () => {
  it('stimulating + stimulating → +1', () => {
    expect(composeAxisA('stimulating', 'stimulating')).toBe(1)
  })
  it('stimulating + mixed → 0', () => {
    expect(composeAxisA('stimulating', 'mixed')).toBe(0)
  })
  it('stimulating + restorative → 0', () => {
    expect(composeAxisA('stimulating', 'restorative')).toBe(0)
  })
  it('mixed + stimulating → 0', () => {
    expect(composeAxisA('mixed', 'stimulating')).toBe(0)
  })
  it('mixed + mixed → 0', () => {
    expect(composeAxisA('mixed', 'mixed')).toBe(0)
  })
  it('mixed + restorative → 0', () => {
    expect(composeAxisA('mixed', 'restorative')).toBe(0)
  })
  it('restorative + stimulating → 0', () => {
    expect(composeAxisA('restorative', 'stimulating')).toBe(0)
  })
  it('restorative + mixed → 0', () => {
    expect(composeAxisA('restorative', 'mixed')).toBe(0)
  })
  it('restorative + restorative → -1', () => {
    expect(composeAxisA('restorative', 'restorative')).toBe(-1)
  })
})

describe('composeAxisB — full truth table', () => {
  it('immersive + immersive → -1', () => {
    expect(composeAxisB('immersive', 'immersive')).toBe(-1)
  })
  it('immersive + mixed → 0', () => {
    expect(composeAxisB('immersive', 'mixed')).toBe(0)
  })
  it('immersive + enclaved → 0', () => {
    expect(composeAxisB('immersive', 'enclaved')).toBe(0)
  })
  it('mixed + immersive → 0', () => {
    expect(composeAxisB('mixed', 'immersive')).toBe(0)
  })
  it('mixed + mixed → 0', () => {
    expect(composeAxisB('mixed', 'mixed')).toBe(0)
  })
  it('mixed + enclaved → 0', () => {
    expect(composeAxisB('mixed', 'enclaved')).toBe(0)
  })
  it('enclaved + immersive → 0', () => {
    expect(composeAxisB('enclaved', 'immersive')).toBe(0)
  })
  it('enclaved + mixed → 0', () => {
    expect(composeAxisB('enclaved', 'mixed')).toBe(0)
  })
  it('enclaved + enclaved → +1', () => {
    expect(composeAxisB('enclaved', 'enclaved')).toBe(1)
  })
})
