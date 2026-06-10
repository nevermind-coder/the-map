import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Container, Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Divider } from '@mui/material'
import { getCityById } from '../data/index.js'
import { useProfile } from '../context/ProfileContext.jsx'
import { CRITERIA, CRITERIA_LABELS, WEIGHTED_CRITERIA } from '../domain/criteria.js'
import AiInsight from '../components/AiInsight.jsx'
import { useStreamText } from '../hooks/useStreamText.js'
import { streamComparisonAdvice } from '../services/ai.js'

const TAG_CRITERIA = [CRITERIA.CLUB_PRESENCE, CRITERIA.AUTHENTICITY, CRITERIA.SAFETY]
const TAG_COLORS = {
  local: 'success', mixed: 'default', touristy: 'warning',
  none: 'default', some: 'warning', heavy: 'error',
  safe: 'success', soft_crime: 'warning', hard_crime: 'error',
}

function winnerColor(vals, idx) {
  const max = Math.max(...vals.filter(v => typeof v === 'number'))
  return vals[idx] === max ? 'primary.light' : 'transparent'
}

function ComparisonInsight({ profile, districts }) {
  const districtIds = districts.map(d => d.id).join(',')
  const { text, loading, error } = useStreamText(
    () => streamComparisonAdvice(profile, districts),
    [profile.derived?.persona, districtIds]
  )
  return <AiInsight text={text} loading={loading} error={error} label="Our online helper — my recommendation" />
}

export default function CompareView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const city = getCityById(id)
  const profile = useProfile()

  const districtIds = (searchParams.get('districts') ?? '').split(',').filter(Boolean)
  const districts = districtIds
    .map(did => city?.districts.find(d => d.id === did))
    .filter(Boolean)

  if (!city || districts.length < 2) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography sx={{ mb: 2 }}>Select 2–3 neighborhoods from the results page to compare.</Typography>
        <Button variant="contained" onClick={() => navigate(`/city/${id}/results`)}>Back to results</Button>
      </Container>
    )
  }

  const numericCriteria = WEIGHTED_CRITERIA
  const allCriteria = [...numericCriteria, ...TAG_CRITERIA]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button variant="text" onClick={() => navigate(`/city/${id}/results`)} sx={{ mb: 2 }}>← Results</Button>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Compare neighborhoods</Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: 180 }}>Criterion</TableCell>
              {districts.map(d => (
                <TableCell key={d.id} align="center" sx={{ fontWeight: 700 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate(`/city/${id}/district/${d.id}`)}
                    sx={{ fontWeight: 700 }}
                  >
                    {d.name}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allCriteria.map(criterion => {
              const values = districts.map(d => d.scores[criterion])
              const isNumeric = numericCriteria.includes(criterion)

              return (
                <TableRow key={criterion}>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    {CRITERIA_LABELS[criterion]}
                  </TableCell>
                  {districts.map((d, idx) => {
                    const val = d.scores[criterion]
                    const bgColor = isNumeric ? winnerColor(values, idx) : 'transparent'
                    return (
                      <TableCell
                        key={d.id}
                        align="center"
                        sx={{ bgcolor: bgColor, fontWeight: bgColor !== 'transparent' ? 700 : 400 }}
                      >
                        {isNumeric ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <Typography fontWeight="inherit">{val}</Typography>
                            <Typography variant="caption" color="text.secondary">/10</Typography>
                          </Box>
                        ) : (
                          <Chip label={val} size="small" color={TAG_COLORS[val] ?? 'default'} />
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {profile.derived && <ComparisonInsight profile={profile} districts={districts} />}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {districts.map(d => (
          <Button
            key={d.id}
            variant="outlined"
            onClick={() => navigate(`/city/${id}/district/${d.id}`)}
          >
            Full profile: {d.name}
          </Button>
        ))}
      </Box>
    </Container>
  )
}
