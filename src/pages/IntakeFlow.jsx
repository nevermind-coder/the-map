import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Box, Button, Stack, Typography } from '@mui/material'
import StepIndicator from '../components/StepIndicator.jsx'
import Layer1Intake from '../intake/Layer1Intake.jsx'
import Layer2Intake from '../intake/Layer2Intake.jsx'
import Layer3Intake from '../intake/Layer3Intake.jsx'
import ModifiersIntake from '../intake/ModifiersIntake.jsx'
import { useProfile, useProfileDispatch } from '../context/ProfileContext.jsx'
import { getCityById } from '../data/index.js'

export default function IntakeFlow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = useProfile()
  const dispatch = useProfileDispatch()
  const city = getCityById(id)

  const [step, setStep] = useState(0)

  useEffect(() => { window.scrollTo(0, 0) }, [step])

  if (!city) return null

  const handleNext = () => {
    if (step < 3) {
      setStep(s => s + 1)
    } else {
      dispatch({
        type: 'COMPUTE_DERIVED',
        payload: { districts: city.districts, cityTypology: city.cityTypology },
      })
      navigate(`/city/${id}/results`)
    }
  }

  const handleBack = () => setStep(s => s - 1)

  const updateLayer1 = (patch) => dispatch({ type: 'SET_LAYER1', payload: patch })
  const updateLayer2 = (patch) => dispatch({ type: 'SET_LAYER2', payload: patch })
  const updateLayer3 = (patch) => dispatch({ type: 'SET_LAYER3', payload: patch })
  const updateModifiers = (patch) => dispatch({ type: 'SET_MODIFIERS', payload: patch })
  const updateTags = (patch) => dispatch({ type: 'SET_CONTEXTUAL_TAGS', payload: patch })

  const nextLabel = step === 3 ? 'See my results →' : 'Continue →'
  const canSkip = step === 3

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button variant="text" onClick={() => navigate(`/city/${id}`)} sx={{ mb: 2 }}>
        ← {city.name}
      </Button>

      <StepIndicator activeStep={step} />

      <Box sx={{ minHeight: 400 }}>
        {step === 0 && (
          <Layer1Intake answers={profile.layer1} onChange={updateLayer1} />
        )}
        {step === 1 && (
          <Layer2Intake answers={profile.layer2} onChange={updateLayer2} />
        )}
        {step === 2 && (
          <Layer3Intake answers={profile.layer3} onChange={updateLayer3} />
        )}
        {step === 3 && (
          <ModifiersIntake
            modifiers={profile.modifiers}
            contextualTags={profile.contextualTags}
            availableTags={city.contextualTagsAvailable}
            onModifierChange={updateModifiers}
            onTagChange={updateTags}
            profile={profile}
          />
        )}
      </Box>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
        <Box>
          {step > 0 && (
            <Button variant="outlined" onClick={handleBack}>← Back</Button>
          )}
        </Box>
        <Stack direction="row" spacing={2}>
          {canSkip && (
            <Button variant="text" onClick={handleNext}>Skip</Button>
          )}
          <Button variant="contained" onClick={handleNext}>{nextLabel}</Button>
        </Stack>
      </Stack>
    </Container>
  )
}
