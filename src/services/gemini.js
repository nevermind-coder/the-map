async function* streamFromApi(endpoint, body) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) throw new Error(`Gemini proxy error: ${response.status}`)

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value, { stream: true })
    if (text) yield text
  }
}

export async function* streamPersonaInsight(profile) {
  yield* streamFromApi('/api/gemini/persona-insight', { profile })
}

export async function* streamDistrictInsight(profile, district) {
  yield* streamFromApi('/api/gemini/district-insight', { profile, district })
}

export async function* streamDistrictNarrative(profile, district) {
  yield* streamFromApi('/api/gemini/district-narrative', { profile, district })
}

export async function* streamComparisonAdvice(profile, districts) {
  yield* streamFromApi('/api/gemini/comparison-advice', { profile, districts })
}

export async function generateCityData(cityName) {
  const response = await fetch('/api/gemini/generate-city', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cityName }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error ?? `Server error ${response.status}`)
  }
  return response.json()
}

export async function analyzeIntentText(freeText, profile) {
  try {
    const response = await fetch('/api/gemini/analyze-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ freeText, profile }),
    })
    const data = await response.json()
    return data.tags ?? []
  } catch {
    return []
  }
}
