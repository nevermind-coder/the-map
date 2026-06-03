import { createContext, useContext, useReducer, useEffect } from 'react'
import { composeAxisA, composeAxisB } from '../profile/composeAxis.js'
import { computeWeights } from '../engine/composition.js'
import { projectPersona } from '../engine/personaProjection.js'
import { rankDistricts } from '../engine/rankDistricts.js'

const ProfileContext = createContext(null)
const DispatchContext = createContext(null)

const DEFAULT_STATE = {
  layer1: { q1: null, q2: null, q3: null, q4: null, q5: null, q6: { ranked: [], allOfIt: false } },
  layer2: { party: null, childAges: [], accessibility: [], walkingTolerance: 3, dietary: [] },
  layer3: { dates: null, budget: null, dealbreakers: [] },
  modifiers: { firstTime: null, specialOccasion: 'none', freeText: '' },
  contextualTags: { pilgrimage: false, fandom: false, counterculture: false, lgbtq: false },
  derived: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LAYER1':
      return { ...state, layer1: { ...state.layer1, ...action.payload } }
    case 'SET_LAYER2':
      return { ...state, layer2: { ...state.layer2, ...action.payload } }
    case 'SET_LAYER3':
      return { ...state, layer3: { ...state.layer3, ...action.payload } }
    case 'SET_MODIFIERS':
      return { ...state, modifiers: { ...state.modifiers, ...action.payload } }
    case 'SET_CONTEXTUAL_TAGS':
      return { ...state, contextualTags: { ...state.contextualTags, ...action.payload } }
    case 'COMPUTE_DERIVED': {
      const { districts, cityTypology } = action.payload
      const { q1, q2, q3, q4, q6 } = state.layer1
      const axisA = composeAxisA(q1, q2)
      const axisB = composeAxisB(q3, q4)
      const weights = computeWeights(axisA, axisB)
      const { cell, persona, isWeakFit } = projectPersona(axisA, axisB)
      const rankedDistricts = rankDistricts(districts, weights, axisA, axisB, cityTypology, q6)
      return {
        ...state,
        derived: { axisA, axisB, cell, persona, isWeakFit, weights, rankedDistricts },
      }
    }
    case 'SET_CUSTOM_WEIGHTS': {
      if (!state.derived) return state
      return { ...state, derived: { ...state.derived, weights: action.payload } }
    }
    case 'RESET':
      return DEFAULT_STATE
    case 'LOAD':
      return action.payload
    default:
      return state
  }
}

export function ProfileProvider({ cityId, children }) {
  const storageKey = `the-map-profile-${cityId}`

  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE, init => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : init
    } catch {
      return init
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch { /* storage full or unavailable */ }
  }, [state, storageKey])

  return (
    <DispatchContext.Provider value={dispatch}>
      <ProfileContext.Provider value={state}>
        {children}
      </ProfileContext.Provider>
    </DispatchContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}

export function useProfileDispatch() {
  return useContext(DispatchContext)
}
