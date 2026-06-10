import { useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, Box, Button, Chip, Divider, Stack, Card, CardContent, Alert } from '@mui/material'
import CriteriaBar from '../components/CriteriaBar.jsx'
import { getCityById } from '../data/index.js'
import { useProfile } from '../context/ProfileContext.jsx'
import { VALUE_TYPE_LABELS } from '../domain/valueTypes.js'
import { CRITERIA, CRITERIA_LABELS } from '../domain/criteria.js'

const SAFETY_LABEL = { safe: 'Safe area', soft_crime: 'Watch Out — some petty crime reported', hard_crime: 'High-crime area' }
const SAFETY_SEVERITY = { safe: 'success', soft_crime: 'warning', hard_crime: 'error' }

export default function DistrictProfile() {
  const { id, districtId } = useParams()
  const navigate = useNavigate()
  const profile = useProfile()
  const city = getCityById(id)

  if (!city) return null

  const district = city.districts.find(d => d.id === districtId)
  if (!district) return <Container sx={{ py: 4 }}><Typography>District not found.</Typography></Container>

  const persona = profile.derived?.persona
  const bestForLine = persona && district.bestFor?.[persona]

  const numericCriteria = [
    CRITERIA.DAYTIME_LIFE,
    CRITERIA.EVENING_LIFE,
    CRITERIA.PROXIMITY,
    CRITERIA.STRATEGIC_LOCATION,
    CRITERIA.PEDESTRIAN_COMFORT,
    CRITERIA.TRANSPORT,
    CRITERIA.PRICE_LEVEL,
  ]

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Back</Button>

      <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>{district.name}</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        {district.oneLineSummary}
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
        {district.valueTypesPresent.map(vt => (
          <Chip key={vt} label={VALUE_TYPE_LABELS[vt]} color="primary" variant="outlined" size="small" />
        ))}
        {district.sacredSubTag && (
          <Chip label="Sacred" color="secondary" variant="outlined" size="small" />
        )}
      </Stack>

      {district.scores.safety !== 'safe' && (
        <Alert severity={SAFETY_SEVERITY[district.scores.safety]} sx={{ mb: 2 }}>
          {SAFETY_LABEL[district.scores.safety]}
        </Alert>
      )}

      {bestForLine && (
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 2, p: 2, mb: 2, color: 'white' }}>
          <Typography variant="overline" sx={{ opacity: 0.8 }}>Best for {persona}</Typography>
          <Typography variant="body1" fontWeight={500}>{bestForLine}</Typography>
        </Box>
      )}

      <Typography variant="body1" sx={{ mt: 3, mb: 3, lineHeight: 1.8 }}>{district.description}</Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Scores</Typography>

      {numericCriteria.map(c => (
        <CriteriaBar key={c} criterionKey={c} value={district.scores[c]} />
      ))}

      <Box sx={{ mt: 2 }}>
        <CriteriaBar criterionKey={CRITERIA.CLUB_PRESENCE} value={district.scores.clubPresence} />
        <CriteriaBar criterionKey={CRITERIA.AUTHENTICITY} value={district.scores.authenticity} />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Stack spacing={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} color="primary">🔥 Hot Spot</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{district.hotSpot}</Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} color="warning.main">⚠ Watch Out</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{district.watchOut}</Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} color="success.main">💡 Booking Tip</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{district.bookingTip}</Typography>
          </CardContent>
        </Card>
      </Stack>

      {district.bestFor && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Best for…</Typography>
          <Stack spacing={1}>
            {Object.entries(district.bestFor).map(([p, desc]) => (
              <Box key={p} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Chip
                  label={p}
                  size="small"
                  color={p === persona ? 'primary' : 'default'}
                  variant={p === persona ? 'filled' : 'outlined'}
                  sx={{ flexShrink: 0, mt: 0.3 }}
                />
                <Typography variant="body2" color="text.secondary">{desc}</Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}
    </Container>
  )
}
