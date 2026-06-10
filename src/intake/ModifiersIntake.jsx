import { useState, useEffect } from 'react'
import { Box, Typography, ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, MenuItem, TextField, Divider, FormControlLabel, Switch, Stack, Chip } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { analyzeIntentText } from '../services/ai.js'

const SPECIAL_OCCASIONS = ['none', 'honeymoon', 'anniversary', 'birthday', 'bleisure', 'other']

export default function ModifiersIntake({ modifiers, contextualTags, availableTags, onModifierChange, onTagChange, profile }) {
  const [detectedTags, setDetectedTags] = useState([])

  useEffect(() => {
    const text = modifiers.freeText?.trim()
    if (!text) { setDetectedTags([]); return }

    const timer = setTimeout(async () => {
      const tags = await analyzeIntentText(text, profile ?? {})
      setDetectedTags(tags)
    }, 800)

    return () => clearTimeout(timer)
  }, [modifiers.freeText, profile])

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Final touches</Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>First time in this city?</Typography>
        <ToggleButtonGroup
          exclusive
          value={modifiers.firstTime}
          onChange={(_, val) => val !== null && onModifierChange({ firstTime: val })}
        >
          <ToggleButton value={true}>Yes, first time</ToggleButton>
          <ToggleButton value={false}>I've been before</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Special occasion?</InputLabel>
          <Select
            value={modifiers.specialOccasion ?? 'none'}
            label="Special occasion?"
            onChange={e => onModifierChange({ specialOccasion: e.target.value })}
          >
            {SPECIAL_OCCASIONS.map(o => (
              <MenuItem key={o} value={o} sx={{ textTransform: 'capitalize' }}>{o}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: detectedTags.length ? 1.5 : 4 }}>
        <TextField
          fullWidth
          label="Anything else we should know? (optional)"
          multiline
          rows={2}
          value={modifiers.freeText ?? ''}
          onChange={e => onModifierChange({ freeText: e.target.value })}
        />
      </Box>

      {detectedTags.length > 0 && (
        <Box sx={{ mb: 3.5, px: 1.5, py: 1.25, bgcolor: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <AutoAwesomeIcon sx={{ fontSize: 13, color: '#6366f1' }} />
            <Typography variant="overline" sx={{ fontSize: '0.62rem', letterSpacing: 1, color: '#6366f1', lineHeight: 1 }}>
              Our online helper detected
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {detectedTags.map(tag => (
              <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ borderColor: 'rgba(99,102,241,0.4)', color: 'text.secondary', fontSize: '0.75rem' }} />
            ))}
          </Stack>
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        This city has some special angles — do any apply to you?
      </Typography>
      <Stack spacing={1}>
        <FormControlLabel
          label="I'm travelling partly for pilgrimage / faith reasons"
          control={
            <Switch
              checked={contextualTags.pilgrimage ?? false}
              onChange={e => onTagChange({ pilgrimage: e.target.checked })}
            />
          }
        />
        <FormControlLabel
          label="I have pop-culture or fandom destinations on my list"
          control={
            <Switch
              checked={contextualTags.fandom ?? false}
              onChange={e => onTagChange({ fandom: e.target.checked })}
            />
          }
        />
        <FormControlLabel
          label="I'm interested in counterculture and alternative scenes"
          control={
            <Switch
              checked={contextualTags.counterculture ?? false}
              onChange={e => onTagChange({ counterculture: e.target.checked })}
            />
          }
        />
        <FormControlLabel
          label="LGBTQ+"
          control={
            <Switch
              checked={contextualTags.lgbtq ?? false}
              onChange={e => onTagChange({ lgbtq: e.target.checked })}
            />
          }
        />
      </Stack>
    </Box>
  )
}
