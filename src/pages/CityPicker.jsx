import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Typography, Card, CardActionArea, CardContent, Box, TextField, Chip, Button, CircularProgress, Alert, Autocomplete } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { getAllCities, cacheCity } from '../data/index.js'
import { generateCityData } from '../services/ai.js'

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
  const [geoSuggestions, setGeoSuggestions] = useState([])
  const abortRef = useRef(null)
  const navigate = useNavigate()

  const trimmed = query.trim()
  const allCities = getAllCities()
  const filtered = allCities.filter(c =>
    c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
    c.country.toLowerCase().includes(trimmed.toLowerCase())
  )

  const exactMatch = allCities.find(c => c.name.toLowerCase() === trimmed.toLowerCase())
  const showAiButton = trimmed.length >= 2 && !exactMatch

  useEffect(() => {
    if (trimmed.length < 1) { setGeoSuggestions([]); return }

    const timer = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort()
      abortRef.current = new AbortController()
      const signal = abortRef.current.signal
      try {
        const existing = new Set(allCities.map(c => c.name.toLowerCase()))

        const [cityRes, countryRes] = await Promise.allSettled([
          fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=40&language=en&format=json`,
            { signal }
          ),
          fetch(`/api/country-cities?q=${encodeURIComponent(trimmed)}`, { signal }),
        ])

        const suggestions = []

        if (cityRes.status === 'fulfilled' && cityRes.value.ok) {
          const data = await cityRes.value.json()
          const cities = (data.results ?? [])
            .filter(r => !existing.has(r.name.toLowerCase()))
            .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
            .slice(0, 10)
            .map(r => ({ id: `ext:${r.id}`, name: r.name, country: r.country ?? '', isExternal: true, type: 'city' }))
          suggestions.push(...cities)
        }

        if (countryRes.status === 'fulfilled' && countryRes.value.ok) {
          const countryCities = await countryRes.value.json()
          const alreadyInList = new Set(suggestions.map(s => s.name.toLowerCase()))
          const extras = (countryCities ?? [])
            .filter(c => !existing.has(c.name.toLowerCase()) && !alreadyInList.has(c.name.toLowerCase()))
          suggestions.push(...extras)
        }

        setGeoSuggestions(suggestions)
      } catch (e) {
        if (e.name !== 'AbortError') setGeoSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [trimmed])

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

      <Autocomplete
        freeSolo
        options={[...filtered, ...geoSuggestions]}
        getOptionLabel={option => typeof option === 'string' ? option : option.name}
        filterOptions={x => x}
        inputValue={query}
        onInputChange={(_, value, reason) => {
          if (reason !== 'reset') { setQuery(value); setError(null) }
        }}
        onChange={(_, value) => {
          if (!value || typeof value === 'string') return
          if (value.isExternal) {
            setQuery(value.name)
          } else {
            handleSelect(value.id)
          }
        }}
        groupBy={option => {
          if (!option.isExternal) return 'Saved cities'
          if (option.type === 'country') return `Cities in ${option.country}`
          return 'Search results'
        }}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1">{option.name}</Typography>
                <Typography variant="caption" color="text.secondary">{option.country}</Typography>
              </Box>
              {option.isExternal && (
                <AutoAwesomeIcon sx={{ fontSize: 14, color: '#6366f1', ml: 1, flexShrink: 0 }} />
              )}
            </Box>
          </li>
        )}
        renderInput={params => (
          <TextField
            {...params}
            placeholder="Search or type any city…"
            onKeyDown={handleKeyDown}
            disabled={generating}
          />
        )}
        sx={{ mb: 2 }}
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
          {generating ? `Mapping ${trimmed} with our online helper…` : `Explore "${trimmed}" with our online helper`}
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
