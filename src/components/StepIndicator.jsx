import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material'

const STEPS = ['Your vibe', 'Your group', 'Practical', 'Final touches']

export default function StepIndicator({ activeStep }) {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {STEPS.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
