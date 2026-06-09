import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, Box, Button, Divider, Chip, Alert, Stack } from '@mui/material'
import DistrictCard from '../components/DistrictCard.jsx'
import AiInsight from '../components/AiInsight.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { getCityById } from '../data/index.js'
import { PERSONA_DESCRIPTIONS } from '../engine/personaProjection.js'
import { useStreamText } from '../hooks/useStreamText.js'
import { streamPersonaInsight, streamDistrictInsight } from '../services/gemini.js'

function PersonaInsight({ profile }) {
  const { text, loading, error } = useStreamText(
    () => streamPersonaInsight(profile),
    [profile.derived?.persona, profile.modifiers?.freeText]
  )
  return <AiInsight text={text} loading={loading} error={error} label="Gemini — your travel style" />
}

function DistrictInsight({ profile, district }) {
  const { text, loading, error } = useStreamText(
    () => streamDistrictInsight(profile, district),
    [profile.derived?.persona, district.id]
  )
  return <AiInsight text={text} loading={loading} error={error} label="Why this works for you" />
}

export default function RankedResults() {
  const { id } = useParams()
  const navigate = useNavigate()
  const profile = useProfile()
  const city = getCityById(id)

  const [showAll, setShowAll] = useState(false)
  const [compareList, setCompareList] = useState([])

  if (!city || !profile.derived) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography sx={{ mb: 2 }}>Complete the profile questionnaire first.</Typography>
        <Button variant="contained" onClick={() => navigate(`/city/${id}/intake`)}>
          Start profile
        </Button>
      </Container>
    )
  }

  const { rankedDistricts, persona, cell } = profile.derived
  const qualified = rankedDistricts.filter(r => !r.hardDisqualified)
  const disqualified = rankedDistricts.filter(r => r.hardDisqualified)
  const top3 = qualified.slice(0, 3)
  const rest = qualified.slice(3)

  const handleToggleCompare = (districtId) => {
    setCompareList(prev =>
      prev.includes(districtId)
        ? prev.filter(d => d !== districtId)
        : prev.length < 3 ? [...prev, districtId] : prev
    )
  }

  const handleCompare = () => navigate(`/city/${id}/compare?districts=${compareList.join(',')}`)

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button variant="text" onClick={() => navigate(`/city/${id}`)} sx={{ mb: 2 }}>
        ← {city.name}
      </Button>

      <Box sx={{ mb: 3, p: 3, bgcolor: 'primary.main', borderRadius: 3, color: 'white' }}>
        <Typography variant="overline" sx={{ opacity: 0.8 }}>Your traveler profile</Typography>
        <Typography variant="h4" fontWeight={700}>{persona}</Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
          {PERSONA_DESCRIPTIONS[persona]}
        </Typography>
        <Chip
          label={`Cell: ${cell}`}
          size="small"
          sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
        />
      </Box>

      <PersonaInsight profile={profile} />

      {compareList.length >= 2 && (
        <Alert
          severity="info"
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleCompare}>
              Compare {compareList.length}
            </Button>
          }
        >
          {compareList.length} neighborhood{compareList.length > 1 ? 's' : ''} selected for comparison
        </Alert>
      )}

      <Typography variant="h5" fontWeight={700} sx={{ mt: 3, mb: 2 }}>Top picks for you</Typography>

      {top3.map((ranked, i) => (
        <Box key={ranked.district.id}>
          <DistrictCard
            ranked={ranked}
            rank={i + 1}
            cityId={id}
            persona={persona}
            showCheckbox
            checked={compareList.includes(ranked.district.id)}
            onToggleCheck={handleToggleCompare}
          />
          <DistrictInsight profile={profile} district={ranked.district} />
        </Box>
      ))}

      {rest.length > 0 && (
        <>
          <Button variant="text" onClick={() => setShowAll(v => !v)} sx={{ mb: 2, mt: 1 }}>
            {showAll ? 'Show less' : `See all ${rest.length} more →`}
          </Button>
          {showAll && rest.map((ranked, i) => (
            <DistrictCard
              key={ranked.district.id}
              ranked={ranked}
              rank={i + 4}
              cityId={id}
              persona={persona}
              showCheckbox
              checked={compareList.includes(ranked.district.id)}
              onToggleCheck={handleToggleCompare}
            />
          ))}
        </>
      )}

      {disqualified.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Not recommended for your profile
          </Typography>
          {disqualified.map(ranked => (
            <DistrictCard key={ranked.district.id} ranked={ranked} rank={99} cityId={id} />
          ))}
        </>
      )}

      <Divider sx={{ my: 3 }} />
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => navigate(`/city/${id}/custom-weights`)}>
          Adjust weights
        </Button>
        <Button variant="outlined" onClick={() => navigate(`/city/${id}/intake`)}>
          Redo profile
        </Button>
      </Stack>
    </Container>
  )
}
