import { Box, Typography, Stack, Chip, Slider, FormGroup, FormControlLabel, Checkbox } from '@mui/material'

const PARTY_OPTIONS = ['solo', 'couple', 'friends', 'family', 'multigen']
const ACCESSIBILITY_OPTIONS = ['wheelchair', 'limited mobility', 'stroller', 'visual impairment']
const DIETARY_OPTIONS = ['vegetarian', 'vegan', 'kosher', 'halal']
const WALKING_MARKS = [
  { value: 1, label: 'Very low' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Moderate' },
  { value: 4, label: 'High' },
  { value: 5, label: 'Very high' },
]

function ChipSelect({ options, value, onChange, multi }) {
  const handleClick = (opt) => {
    if (!multi) {
      onChange(opt)
      return
    }
    const current = value ?? []
    const next = current.includes(opt) ? current.filter(v => v !== opt) : [...current, opt]
    onChange(next)
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {options.map(opt => {
        const active = multi ? (value ?? []).includes(opt) : value === opt
        return (
          <Chip
            key={opt}
            label={opt}
            clickable
            color={active ? 'primary' : 'default'}
            variant={active ? 'filled' : 'outlined'}
            onClick={() => handleClick(opt)}
            sx={{ mb: 1, textTransform: 'capitalize' }}
          />
        )
      })}
    </Stack>
  )
}

export default function Layer2Intake({ answers, onChange }) {
  const showChildAges = answers.party === 'family' || answers.party === 'multigen'

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Your group</Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Who's travelling?</Typography>
        <ChipSelect options={PARTY_OPTIONS} value={answers.party} onChange={val => onChange({ party: val })} />
      </Box>

      {showChildAges && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Child ages (select all that apply)</Typography>
          <ChipSelect
            options={['0–2', '3–6', '7–12', '13–17']}
            value={answers.childAges}
            onChange={val => onChange({ childAges: val })}
            multi
          />
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Accessibility needs</Typography>
        <FormGroup row>
          {ACCESSIBILITY_OPTIONS.map(opt => (
            <FormControlLabel
              key={opt}
              label={opt}
              sx={{ textTransform: 'capitalize' }}
              control={
                <Checkbox
                  checked={(answers.accessibility ?? []).includes(opt)}
                  onChange={() => {
                    const current = answers.accessibility ?? []
                    const next = current.includes(opt) ? current.filter(v => v !== opt) : [...current, opt]
                    onChange({ accessibility: next })
                  }}
                />
              }
            />
          ))}
        </FormGroup>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          How much walking are you comfortable with daily?
        </Typography>
        <Slider
          value={answers.walkingTolerance ?? 3}
          min={1}
          max={5}
          step={1}
          marks={WALKING_MARKS}
          valueLabelDisplay="auto"
          onChange={(_, val) => onChange({ walkingTolerance: val })}
          sx={{ mt: 2 }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Dietary needs (if relevant)</Typography>
        <ChipSelect
          options={DIETARY_OPTIONS}
          value={answers.dietary}
          onChange={val => onChange({ dietary: val })}
          multi
        />
      </Box>
    </Box>
  )
}
