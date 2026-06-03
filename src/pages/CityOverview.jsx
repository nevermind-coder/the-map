import { useParams, useNavigate } from 'react-router-dom'
import { Container, Typography, Button, Card, CardActionArea, CardContent, Box, Chip, Stack, Divider } from '@mui/material'
import MapIcon from '@mui/icons-material/Map'
import { getCityById } from '../data/index.js'
import { VALUE_TYPE_LABELS } from '../domain/valueTypes.js'

export default function CityOverview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const city = getCityById(id)

  if (!city) return <Container sx={{ py: 6 }}><Typography>City not found.</Typography></Container>

  const handleStartIntake = () => navigate(`/city/${id}/intake`)
  const handleDistrictClick = (districtId) => navigate(`/city/${id}/district/${districtId}`)

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button variant="text" onClick={() => navigate('/')} sx={{ mb: 2 }}>← All cities</Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight={700}>{city.name}</Typography>
          <Typography variant="body1" color="text.secondary">{city.country}</Typography>
        </Box>
        <Button variant="contained" size="large" onClick={handleStartIntake}>
          Find my neighborhood
        </Button>
      </Box>

      <Box
        sx={{
          bgcolor: 'action.hover',
          borderRadius: 3,
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
        }}
      >
        <Stack alignItems="center" spacing={1}>
          <MapIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography color="text.disabled">Map view — coming in v2</Typography>
        </Stack>
      </Box>

      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        {city.districts.length} neighborhoods
      </Typography>

      {city.districts.map(district => (
        <Card key={district.id} variant="outlined" sx={{ mb: 2 }}>
          <CardActionArea onClick={() => handleDistrictClick(district.id)}>
            <CardContent>
              <Typography variant="h6">{district.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {district.oneLineSummary}
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {district.valueTypesPresent.map(vt => (
                  <Chip
                    key={vt}
                    label={VALUE_TYPE_LABELS[vt]}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ mb: 0.5 }}
                  />
                ))}
                {district.sacredSubTag && (
                  <Chip label="Sacred" size="small" variant="outlined" color="secondary" sx={{ mb: 0.5 }} />
                )}
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}

      <Divider sx={{ my: 3 }} />

      <Button variant="contained" fullWidth size="large" onClick={handleStartIntake}>
        Start profile → get ranked recommendations
      </Button>
    </Container>
  )
}
