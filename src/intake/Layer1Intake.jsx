import { Box, Typography, Divider, Chip, Stack, Alert } from '@mui/material'
import ScenarioCard from '../components/ScenarioCard.jsx'
import { Q6_OPTIONS } from '../domain/valueTypes.js'

const Q1_OPTIONS = [
  { value: 'stimulating', label: 'Weaving through a crowded street — vendors, music, scooters, chaos' },
  { value: 'restorative', label: 'On a balcony with coffee, the city slowly waking up below' },
  { value: 'mixed', label: 'Some mornings one, some mornings the other' },
]

const Q2_OPTIONS = [
  { value: 'stimulating', label: 'Pull up a chair — the day\'s just getting started' },
  { value: 'restorative', label: 'Make a mental note and keep walking back to the hotel' },
  { value: 'mixed', label: 'Could honestly go either way' },
]

const Q3_OPTIONS = [
  { value: 'immersive', label: 'In a local neighborhood — the buzz around you is locals' },
  { value: 'enclaved', label: 'In the tourist quarter — the buzz around you is travelers' },
  { value: 'mixed', label: 'Either one could be home for the week' },
]

const Q4_OPTIONS = [
  { value: 'immersive', label: 'Packed with locals, no English menu, no idea what you\'ll get' },
  { value: 'enclaved', label: 'Packed with travelers, English menu, great reviews' },
  { value: 'mixed', label: 'I\'d decide once I\'m there' },
]

const Q5_OPTIONS = ['8–9am', '10–11pm', 'Any hour']

function QuestionBlock({ label, sublabel, options, value, onChange }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>{label}</Typography>
      {sublabel && <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{sublabel}</Typography>}
      {options.map(opt => (
        <ScenarioCard key={opt.value} option={opt} selected={value === opt.value} onSelect={onChange} />
      ))}
    </Box>
  )
}

export default function Layer1Intake({ answers, onChange }) {
  const handleQ6Toggle = (vtId) => {
    const current = answers.q6?.ranked ?? []
    const allOfIt = answers.q6?.allOfIt ?? false

    if (vtId === 'allOfIt') {
      onChange({ q6: { ranked: [], allOfIt: !allOfIt } })
      return
    }

    if (allOfIt) {
      onChange({ q6: { ranked: [vtId], allOfIt: false } })
      return
    }

    const idx = current.indexOf(vtId)
    let next
    if (idx >= 0) {
      next = current.filter(v => v !== vtId)
    } else if (current.length < 3) {
      next = [...current, vtId]
    } else {
      next = current
    }
    onChange({ q6: { ranked: next, allOfIt: false } })
  }

  const q6Ranked = answers.q6?.ranked ?? []
  const q6AllOfIt = answers.q6?.allOfIt ?? false

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        ~90 seconds · 6 questions about how you travel
      </Alert>

      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Your energy & pace</Typography>

      <QuestionBlock
        label="Q1 — A travel show is filming YOUR perfect day. The director asks: 'What's the opening shot?'"
        options={Q1_OPTIONS}
        value={answers.q1}
        onChange={val => onChange({ q1: val })}
      />

      <QuestionBlock
        label="Q2 — It's 6pm. Feet hurt, camera roll full. You pass a small bar with live music spilling out. You:"
        options={Q2_OPTIONS}
        value={answers.q2}
        onChange={val => onChange({ q2: val })}
      />

      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Local vs. familiar</Typography>

      <QuestionBlock
        label="Q3 — You're booking your stay. Two hotels, same price, same rating, both on lively streets:"
        options={Q3_OPTIONS}
        value={answers.q3}
        onChange={val => onChange({ q3: val })}
      />

      <QuestionBlock
        label="Q4 — Dinner time. Two restaurants on the same block, both packed:"
        options={Q4_OPTIONS}
        value={answers.q4}
        onChange={val => onChange({ q4: val })}
      />

      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Magic hour</Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
          Q5 — The city gives you ONE magic hour — everything is at its best. When?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          This won't affect your ranking — it's just for us.
        </Typography>
        <Stack direction="row" spacing={1}>
          {Q5_OPTIONS.map(opt => (
            <Chip
              key={opt}
              label={opt}
              clickable
              color={answers.q5 === opt ? 'primary' : 'default'}
              variant={answers.q5 === opt ? 'filled' : 'outlined'}
              onClick={() => onChange({ q5: opt })}
            />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>What matters most to you?</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Q6 — Pick up to 3, in order of priority. First pick = most important.
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
        {Q6_OPTIONS.map((opt, idx) => {
          const rankIdx = q6Ranked.indexOf(opt.id)
          const ranked = rankIdx >= 0
          return (
            <Chip
              key={opt.id}
              label={`${opt.emoji} ${opt.label}${ranked ? ` (${rankIdx + 1})` : ''}`}
              clickable
              color={ranked ? 'primary' : 'default'}
              variant={ranked ? 'filled' : 'outlined'}
              onClick={() => handleQ6Toggle(opt.id)}
              sx={{ mb: 1 }}
            />
          )
        })}
      </Stack>

      <Divider sx={{ my: 1.5 }} />

      <Chip
        label={`✨ All of it ${q6AllOfIt ? '(selected)' : ''}`}
        clickable
        color={q6AllOfIt ? 'secondary' : 'default'}
        variant={q6AllOfIt ? 'filled' : 'outlined'}
        onClick={() => handleQ6Toggle('allOfIt')}
        sx={{ mt: 1 }}
      />
    </Box>
  )
}
