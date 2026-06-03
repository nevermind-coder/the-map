import { Card, CardContent, CardActionArea, Typography, Box, Chip, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CRITERIA_LABELS } from '../domain/criteria.js'

const RANK_BADGE = ['🥇', '🥈', '🥉']

function topContributingCriteria(scores) {
  const numeric = ['daytimeLife', 'eveningLife', 'proximityToAttractions', 'strategicLocation', 'pedestrianComfort', 'transportConnections', 'priceLevel']
  return numeric
    .map(k => ({ key: k, score: scores[k] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

export default function DistrictCard({ ranked, rank, cityId, persona, showCheckbox, checked, onToggleCheck }) {
  const navigate = useNavigate()
  const { district, score, hardDisqualified, reason } = ranked

  const handleNavigate = () => navigate(`/city/${cityId}/district/${district.id}`)

  if (hardDisqualified) {
    return (
      <Card variant="outlined" sx={{ opacity: 0.5, mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="text.disabled">{district.name}</Typography>
          <Typography variant="body2" color="text.disabled">Not recommended for your profile</Typography>
          <Chip label="Show anyway" size="small" variant="outlined" sx={{ mt: 1 }}
            onClick={handleNavigate} />
        </CardContent>
      </Card>
    )
  }

  const top3 = topContributingCriteria(district.scores)
  const bestForLine = persona && district.bestFor?.[persona]

  return (
    <Card
      variant={rank <= 3 ? 'elevation' : 'outlined'}
      elevation={rank <= 3 ? 4 : 0}
      sx={{ mb: 2, border: rank === 1 ? '2px solid' : undefined, borderColor: 'primary.main' }}
    >
      <CardActionArea onClick={handleNavigate} sx={{ display: 'block' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {rank <= 3 && <Typography fontSize={20}>{RANK_BADGE[rank - 1]}</Typography>}
            <Typography variant="h6">{district.name}</Typography>
            {showCheckbox && (
              <Chip
                label={checked ? '✓ Selected' : 'Compare'}
                size="small"
                color={checked ? 'primary' : 'default'}
                variant={checked ? 'filled' : 'outlined'}
                onClick={e => { e.stopPropagation(); onToggleCheck(district.id) }}
                sx={{ ml: 'auto' }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {district.oneLineSummary}
          </Typography>
          {bestForLine && (
            <Typography variant="body2" color="primary.main" fontStyle="italic" sx={{ mb: 1.5 }}>
              Best for you: {bestForLine}
            </Typography>
          )}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {top3.map(({ key, score: s }) => (
              <Chip key={key} label={`${CRITERIA_LABELS[key]}: ${s}/10`} size="small" />
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
