import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Card, CardActionArea, CardContent, Box, TextField, Chip, Button, CircularProgress, Alert } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { getAllCities, cacheCity } from '../data/index.js'
import { generateCityData } from '../services/gemini.js'

const TYPE_LABELS = { 1: 'Compact', 2: 'Extended', 3: 'Polycentric', 4: 'Extreme Polycentric' }
const TYPOLOGY_LABELS = {
  concentrated_walkable: 'Walkable',
  polycentric_walkable: 'Polycentric Walkable',
  dispersed_car_dependent: 'Car-Dependent',
}

export default function CityPicker() {
  const [query, setQuery] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const trimmed = query.trim()
  const allCities = getAllCities()
  const filtered = allCities.filter(c =>
    c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
    c.country.toLowerCase().includes(trimmed.toLowerCase())
  )

  const exactMatch = allCities.find(c => c.name.toLowerCase() === trimmed.toLowerCase())
  const showAiButton = trimmed.length >= 2 && !exactMatch

  const handleSelect = (cityId) => navigate(`/city/${cityId}`)

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const city = await generateCityData(trimmed)
      cacheCity(city)
      navigate(`/city/${city.id}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && showAiButton && !generating) handleGenerate()
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>THE MAP</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Find your neighborhood
      </Typography>

      <TextField
        fullWidth
        placeholder="Search or type any city…"
        value={query}
        onChange={e => { setQuery(e.target.value); setError(null) }}
        onKeyDown={handleKeyDown}
        sx={{ mb: 2 }}
        disabled={generating}
      />

      {showAiButton && (
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGenerate}
          disabled={generating}
          startIcon={generating ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
          sx={{
            mb: 3, py: 1.5,
            borderColor: 'rgba(99,102,241,0.4)',
            color: '#6366f1',
            '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99,102,241,0.05)' },
          }}
        >
          {generating ? `Mapping ${trimmed} with Gemini…` : `Explore "${trimmed}" with Gemini`}
        </Button>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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

      {filtered.length === 0 && !showAiButton && (
        <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
          No cities found for "{query}"
        </Typography>
      )}
    </Container>
  )
}
