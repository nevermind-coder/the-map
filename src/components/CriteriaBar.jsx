import { Box, Typography, LinearProgress, Chip } from '@mui/material'
import { CRITERIA_LABELS } from '../domain/criteria.js'

const TAG_COLORS = {
  // authenticity
  local: 'success',
  mixed: 'default',
  touristy: 'warning',
  // club presence
  none: 'default',
  some: 'warning',
  heavy: 'error',
  // safety
  safe: 'success',
  soft_crime: 'warning',
  hard_crime: 'error',
}

export default function CriteriaBar({ criterionKey, value, highlight }) {
  const isNumeric = typeof value === 'number'
  const label = CRITERIA_LABELS[criterionKey] ?? criterionKey

  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color={highlight ? 'primary.main' : 'text.secondary'} fontWeight={highlight ? 600 : 400}>
          {label}
        </Typography>
        {isNumeric && (
          <Typography variant="body2" fontWeight={600} color={highlight ? 'primary.main' : 'text.primary'}>
            {value}/10
          </Typography>
        )}
      </Box>
      {isNumeric ? (
        <LinearProgress
          variant="determinate"
          value={value * 10}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': {
              bgcolor: highlight ? 'primary.main' : 'secondary.main',
            },
          }}
        />
      ) : (
        <Chip
          label={value}
          size="small"
          color={TAG_COLORS[value] ?? 'default'}
        />
      )}
    </Box>
  )
}
