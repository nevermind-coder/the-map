import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, Button, Box, Slider, Stack, Card, CardContent, Divider } from '@mui/material'
import { useProfile, useProfileDispatch } from '../context/ProfileContext.jsx'
import { getCityById } from '../data/index.js'
import { WEIGHTED_CRITERIA, CRITERIA_LABELS } from '../domain/criteria.js'
import { rankDistricts } from '../engine/rankDistricts.js'

function normalizeWeights(raw) {
  const total = Object.values(raw).reduce((s, v) => s + v, 0)
  const normalized = {}
  for (const k of Object.keys(raw)) {
    normalized[k] = raw[k] / total
  }
  return normalized
}

export default function CustomWeights() {
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = useProfile()
  const dispatch = useProfileDispatch()
  const city = getCityById(id)

  const profileWeights = profile.derived?.weights ?? {}

  const [rawSliders, setRawSliders] = useState(() => {
    const init = {}
    WEIGHTED_CRITERIA.forEach(c => {
      init[c] = Math.round((profileWeights[c] ?? 1 / WEIGHTED_CRITERIA.length) * 100)
    })
    return init
  })

  if (!city || !profile.derived) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>Complete the profile first.</Typography>
        <Button onClick={() => navigate(`/city/${id}/intake`)}>Go to profile</Button>
      </Container>
    )
  }

  const updateSlider = (criterion, value) => {
    setRawSliders(prev => ({ ...prev, [criterion]: value }))
  }

  const normalizedDisplay = normalizeWeights(rawSliders)

  const handleApply = () => {
    const normalized = normalizeWeights(rawSliders)
    const { axisA, axisB } = profile.derived
    const reranked = rankDistricts(
      city.districts, normalized, axisA, axisB, city.cityTypology, profile.layer1.q6
    )
    dispatch({ type: 'SET_CUSTOM_WEIGHTS', payload: normalized })
    dispatch({ type: 'COMPUTE_DERIVED', payload: { districts: city.districts, cityTypology: city.cityTypology } })
    navigate(`/city/${id}/results`)
  }

  const handleReset = () => {
    const reset = {}
    WEIGHTED_CRITERIA.forEach(c => {
      reset[c] = Math.round((profileWeights[c] ?? 1 / WEIGHTED_CRITERIA.length) * 100)
    })
    setRawSliders(reset)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button variant="text" onClick={() => navigate(`/city/${id}/results`)} sx={{ mb: 2 }}>
        ← Results
      </Button>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>Adjust weights</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Move the sliders to change how much each criterion influences your ranking.
        The system normalizes everything — only the relative values matter.
      </Typography>

      {WEIGHTED_CRITERIA.map(criterion => (
        <Box key={criterion} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" fontWeight={600}>{CRITERIA_LABELS[criterion]}</Typography>
            <Typography variant="body2" color="text.secondary">
              {(normalizedDisplay[criterion] * 100).toFixed(1)}%
            </Typography>
          </Box>
          <Slider
            value={rawSliders[criterion]}
            min={1}
            max={50}
            step={1}
            onChange={(_, val) => updateSlider(criterion, val)}
          />
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={handleReset}>Reset to my profile</Button>
        <Button variant="contained" onClick={handleApply}>Apply & re-rank</Button>
      </Stack>
    </Container>
  )
}
