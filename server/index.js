import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Groq from 'groq-sdk'
import {
  buildPersonaInsightPrompt,
  buildDistrictInsightPrompt,
  buildDistrictNarrativePrompt,
  buildComparisonAdvicePrompt,
  buildAnalyzeIntentPrompt,
  buildGenerateCityPrompt,
} from './prompts.js'

const app = express()
app.use(cors())
app.use(express.json())

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const MODEL = 'llama-3.3-70b-versatile'

async function streamPrompt(res, prompt) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')
  res.setHeader('Cache-Control', 'no-cache')

  const stream = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  })

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content ?? ''
    if (text) res.write(text)
  }
  res.end()
}

async function completePrompt(prompt, json = false) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    ...(json && { response_format: { type: 'json_object' } }),
  })
  return completion.choices[0]?.message?.content ?? ''
}

app.post('/api/gemini/persona-insight', async (req, res) => {
  try { await streamPrompt(res, buildPersonaInsightPrompt(req.body.profile)) }
  catch (e) { res.status(500).end(e.message) }
})

app.post('/api/gemini/district-insight', async (req, res) => {
  try { await streamPrompt(res, buildDistrictInsightPrompt(req.body.profile, req.body.district)) }
  catch (e) { res.status(500).end(e.message) }
})

app.post('/api/gemini/district-narrative', async (req, res) => {
  try { await streamPrompt(res, buildDistrictNarrativePrompt(req.body.profile, req.body.district)) }
  catch (e) { res.status(500).end(e.message) }
})

app.post('/api/gemini/comparison-advice', async (req, res) => {
  try { await streamPrompt(res, buildComparisonAdvicePrompt(req.body.profile, req.body.districts)) }
  catch (e) { res.status(500).end(e.message) }
})

app.post('/api/gemini/analyze-intent', async (req, res) => {
  try {
    const text = await completePrompt(buildAnalyzeIntentPrompt(req.body.freeText, req.body.profile))
    const match = text.match(/\[.*?\]/s)
    res.json({ tags: match ? JSON.parse(match[0]) : [] })
  } catch (e) {
    res.json({ tags: [] })
  }
})

app.post('/api/gemini/generate-city', async (req, res) => {
  try {
    const { cityName } = req.body
    if (!cityName?.trim()) return res.status(400).json({ error: 'cityName required' })

    const text = await completePrompt(buildGenerateCityPrompt(cityName.trim()), true)
    const city = JSON.parse(text)
    city.id = cityName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    res.json(city)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/country-cities', async (req, res) => {
  const q = (req.query.q ?? '').trim()
  if (q.length < 2) return res.json([])
  try {
    const ccRes = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fullText=false&fields=name,cca2`,
      { headers: { 'User-Agent': 'the-map-app/1.0' } }
    )
    if (!ccRes.ok) return res.json([])
    const ccData = await ccRes.json()
    if (!Array.isArray(ccData) || !ccData.length) return res.json([])
    const countryCode = ccData[0].cca2
    const countryName = ccData[0].name?.common ?? q

    const geoRes = await fetch(
      `https://secure.geonames.org/searchJSON?country=${countryCode}&featureClass=P&orderby=population&maxRows=8&username=demo`,
      { headers: { 'User-Agent': 'the-map-app/1.0' } }
    )
    const geoData = await geoRes.json()
    const cities = (geoData.geonames ?? []).map(g => ({
      id: `country:${g.geonameId}`,
      name: g.name,
      country: countryName,
      isExternal: true,
      type: 'country'
    }))
    res.json(cities)
  } catch {
    res.json([])
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`))
