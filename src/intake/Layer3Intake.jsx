import { Box, Typography, Slider, Stack, Chip, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'ILS', 'JPY', 'AUD']
const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', ILS: '₪', JPY: '¥', AUD: 'A$' }

function getBudgetMarks(currency) {
  const sym = CURRENCY_SYMBOLS[currency] ?? currency
  return [
    { value: 0, label: `${sym}0` },
    { value: 100, label: `${sym}100` },
    { value: 200, label: `${sym}200` },
    { value: 300, label: `${sym}300` },
    { value: 500, label: `${sym}500+` },
  ]
}

const DEALBREAKER_OPTIONS = [
  'Noisy at night',
  'Far from transit',
  'Tourist trap',
  'Very expensive',
  'Poor pedestrian safety',
  'Limited food options',
]

export default function Layer3Intake({ answers, onChange }) {
  const budgetMarks = getBudgetMarks(answers.currency ?? 'USD')
  const currencySymbol = CURRENCY_SYMBOLS[answers.currency ?? 'USD'] ?? (answers.currency ?? 'USD')
  const toggleDealbreaker = (opt) => {
    const current = answers.dealbreakers ?? []
    const next = current.includes(opt) ? current.filter(v => v !== opt) : [...current, opt]
    onChange({ dealbreakers: next })
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Practical details</Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Per-night budget</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={answers.currency ?? 'USD'}
              label="Currency"
              onChange={e => onChange({ currency: e.target.value })}
            >
              {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <Box sx={{ flex: 1 }}>
            <Slider
              value={answers.budget ?? 150}
              min={0}
              max={500}
              step={10}
              marks={budgetMarks}
              valueLabelDisplay="on"
              valueLabelFormat={v => `${currencySymbol}${v}`}
              onChange={(_, val) => onChange({ budget: val })}
            />
          </Box>
        </Stack>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Dealbreakers</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Neighborhoods with these traits will be flagged in your results.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {DEALBREAKER_OPTIONS.map(opt => {
            const active = (answers.dealbreakers ?? []).includes(opt)
            return (
              <Chip
                key={opt}
                label={opt}
                clickable
                color={active ? 'error' : 'default'}
                variant={active ? 'filled' : 'outlined'}
                onClick={() => toggleDealbreaker(opt)}
                sx={{ mb: 1 }}
              />
            )
          })}
        </Stack>
        <TextField
          fullWidth
          label="Anything else? (optional)"
          value={answers.dealbreakersText ?? ''}
          onChange={e => onChange({ dealbreakersText: e.target.value })}
          size="small"
          sx={{ mt: 2 }}
        />
      </Box>
    </Box>
  )
}
