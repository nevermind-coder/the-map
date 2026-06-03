import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Card, CardActionArea, CardContent, Box, TextField, Chip } from '@mui/material'
import { CITIES } from '../data/index.js'

const TYPE_LABELS = { 1: 'Compact', 2: 'Extended', 3: 'Polycentric', 4: 'Extreme Polycentric' }
const TYPOLOGY_LABELS = {
  concentrated_walkable: 'Walkable',
  polycentric_walkable: 'Polycentric Walkable',
  dispersed_car_dependent: 'Car-Dependent',
}

export default function CityPicker() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const filtered = CITIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.country.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (cityId) => navigate(`/city/${cityId}`)

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>THE MAP</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Find your neighborhood
      </Typography>

      <TextField
        fullWidth
        placeholder="Search cities…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      {filtered.map(city => (
        <Card key={city.id} variant="outlined" sx={{ mb: 2 }}>
          <CardActionArea onClick={() => handleSelect(city.id)}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h5" fontWeight={600}>{city.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{city.country}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                  <Chip label={TYPOLOGY_LABELS[city.cityTypology]} size="small" color="primary" variant="outlined" />
                  <Chip label={`Type ${city.cityType} — ${TYPE_LABELS[city.cityType]}`} size="small" />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {city.districts.length} neighborhoods · {city.coverageRange[0]}–{city.coverageRange[1]} coverage areas
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}

      {filtered.length === 0 && (
        <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
          No cities found for "{query}"
        </Typography>
      )}
    </Container>
  )
}
