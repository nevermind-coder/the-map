import { useEffect, useRef, useState } from 'react'
import { Box, Stack, Typography, CircularProgress } from '@mui/material'
import MapIcon from '@mui/icons-material/Map'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const PIN_SVG = (fill = '#1976d2') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="30" viewBox="0 0 22 30">
    <path d="M11 0C4.925 0 0 4.925 0 11c0 8.25 11 19 11 19s11-10.75 11-19C22 4.925 17.075 0 11 0z" fill="${fill}"/>
    <circle cx="11" cy="11" r="4.5" fill="white"/>
  </svg>`

function makePin(fill = '#1976d2') {
  return L.divIcon({
    className: '',
    html: PIN_SVG(fill),
    iconSize: [22, 30],
    iconAnchor: [11, 30],
    popupAnchor: [0, -32],
  })
}

async function geocodeName(name) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`
  )
  const data = await res.json()
  const r = data.results?.[0]
  return r ? { lat: r.latitude, lon: r.longitude } : null
}

// Use Nominatim (OSM) for district geocoding — knows neighborhoods, not just cities.
// Stagger requests to stay within Nominatim's 1 req/sec policy.
async function geocodeDistrict(districtName, cityName, cityCoords, delayMs = 0) {
  if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs))

  const q = `${districtName}, ${cityName}`
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  const results = await res.json()
  if (!results.length) return null

  // From Nominatim results, pick the one closest to the known city center
  const scored = results.map(r => {
    const lat = parseFloat(r.lat)
    const lon = parseFloat(r.lon)
    return { lat, lon, dist: Math.hypot(lat - cityCoords.lat, lon - cityCoords.lon) }
  })
  scored.sort((a, b) => a.dist - b.dist)
  const best = scored[0]

  // Reject if farther than ~0.5 degrees (~55 km) from city center
  if (best.dist > 0.5) return null
  return { lat: best.lat, lon: best.lon }
}

export default function CityMap({ city }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  const [mapCoords, setMapCoords] = useState(city.coordinates ?? null)
  const [districts, setDistricts] = useState(
    (city.districts ?? []).filter(d => d.coordinates)
  )
  // loading = true while we still need to geocode something
  const [loading, setLoading] = useState(
    !city.coordinates || !(city.districts ?? []).some(d => d.coordinates)
  )

  useEffect(() => {
    const existingCoords = city.coordinates ?? null
    const existingDistricts = (city.districts ?? []).filter(d => d.coordinates)

    setMapCoords(existingCoords)
    setDistricts(existingDistricts)

    // Nothing to geocode
    if (existingCoords && existingDistricts.length > 0) {
      setLoading(false)
      return
    }

    setLoading(true)
    let cancelled = false

    const run = async () => {
      // Step 1: get city coords if missing
      let coords = existingCoords
      if (!coords) {
        try { coords = await geocodeName(city.name) } catch {}
        if (cancelled) return
        if (coords) setMapCoords(coords)
      }

      // Step 2: geocode districts via Nominatim (staggered 200 ms apart)
      if (existingDistricts.length === 0 && coords && city.districts?.length) {
        const results = await Promise.all(
          city.districts.map((d, i) =>
            geocodeDistrict(d.name, city.name, coords, i * 200)
              .then(c => c ? { ...d, coordinates: c } : null)
              .catch(() => null)
          )
        )
        if (!cancelled) setDistricts(results.filter(Boolean))
      }

      if (!cancelled) setLoading(false)
    }

    run()
    return () => { cancelled = true }
  }, [city.id])

  // Build / rebuild map whenever coords or district list changes
  useEffect(() => {
    if (!containerRef.current || !mapCoords) return
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }

    const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false })
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    if (districts.length > 0) {
      const markers = districts.map(d => {
        const m = L.marker([d.coordinates.lat, d.coordinates.lon], { icon: makePin('#1976d2') })
          .bindPopup(
            `<b style="font-size:13px">${d.name}</b><br/><span style="font-size:11.5px;color:#555;line-height:1.4">${d.oneLineSummary}</span>`,
            { maxWidth: 220 }
          )
          .addTo(map)
        m.bindTooltip(d.name, {
          permanent: true,
          direction: 'right',
          offset: [4, -15],
          className: 'map-nbhd-label',
        })
        return m
      })
      map.fitBounds(L.featureGroup(markers).getBounds().pad(0.3))
    } else {
      L.marker([mapCoords.lat, mapCoords.lon], { icon: makePin('#e53935') })
        .bindPopup(`<b>${city.name}</b>`)
        .addTo(map)
      map.setView([mapCoords.lat, mapCoords.lon], 12)
    }

    return () => { map.remove(); mapRef.current = null }
  }, [city.id, mapCoords, districts])

  if (loading) {
    return (
      <Box sx={{ borderRadius: 3, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, border: '1px solid', borderColor: 'divider' }}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  if (!mapCoords) {
    return (
      <Box sx={{ bgcolor: 'action.hover', borderRadius: 3, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
        <Stack alignItems="center" spacing={1}>
          <MapIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography color="text.disabled">Map not available for this city</Typography>
        </Stack>
      </Box>
    )
  }

  return (
    <Box sx={{ borderRadius: 3, overflow: 'hidden', mb: 4, height: 300, border: '1px solid', borderColor: 'divider' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  )
}
