function profileSummary(profile) {
  const { layer1, layer2, layer3, modifiers, contextualTags, derived } = profile
  const parts = []

  if (derived?.persona) parts.push(`Persona: ${derived.persona}`)

  const energyLabel = { '-1': 'restorative', '0': 'balanced', '1': 'stimulating' }
  const localLabel = { '-1': 'immersive/local', '0': 'mixed', '1': 'tourist-comfortable' }
  if (derived?.axisA !== undefined) parts.push(`Energy: ${energyLabel[String(derived.axisA)]}`)
  if (derived?.axisB !== undefined) parts.push(`Localism: ${localLabel[String(derived.axisB)]}`)

  if (layer1?.q6?.allOfIt) parts.push('Priorities: everything')
  else if (layer1?.q6?.ranked?.length) parts.push(`Priorities: ${layer1.q6.ranked.join(', ')}`)

  if (layer2?.party) parts.push(`Travel party: ${layer2.party}`)
  if (layer2?.walkingTolerance) parts.push(`Walking tolerance: ${layer2.walkingTolerance}/5`)
  if (layer2?.accessibility?.length) parts.push(`Accessibility needs: ${layer2.accessibility.join(', ')}`)
  if (layer3?.dealbreakers?.length) parts.push(`Dealbreakers: ${layer3.dealbreakers.join(', ')}`)
  if (modifiers?.specialOccasion && modifiers.specialOccasion !== 'none') parts.push(`Special occasion: ${modifiers.specialOccasion}`)
  if (modifiers?.firstTime !== null) parts.push(`First time visiting: ${modifiers.firstTime ? 'yes' : 'no'}`)
  if (modifiers?.freeText?.trim()) parts.push(`Traveler note: "${modifiers.freeText}"`)

  const tags = Object.entries(contextualTags ?? {}).filter(([, v]) => v).map(([k]) => k)
  if (tags.length) parts.push(`Special interests: ${tags.join(', ')}`)

  return parts.join('\n')
}

export function buildPersonaInsightPrompt(profile) {
  return `You are THE MAP, an AI travel companion inside a neighborhood recommendation app.

A traveler's profile has just been analyzed. Here is their full profile:
${profileSummary(profile)}

Write 2-3 concise, direct sentences speaking to this traveler about what makes their ideal neighborhood experience. Use "you" voice. Be specific to their persona and actual answers. Make them feel understood. No bullet points. No generic travel clichés.`
}

export function buildDistrictInsightPrompt(profile, district) {
  return `You are THE MAP, an AI travel companion inside a neighborhood recommendation app.

Traveler profile:
${profileSummary(profile)}

Neighborhood being recommended:
Name: ${district.name}
Summary: ${district.oneLineSummary}
Value types: ${district.valueTypesPresent?.join(', ') ?? 'varied'}
Authenticity: ${district.scores.authenticity}
Club presence: ${district.scores.clubPresence}
Daytime life: ${district.scores.daytimeLife}/10
Evening life: ${district.scores.eveningLife}/10
Safety: ${district.scores.safety}
Pedestrian comfort: ${district.scores.pedestrianComfort}/10
Price level: ${district.scores.priceLevel}/10

Write exactly 2 sentences explaining why this neighborhood is the right fit for this specific traveler. Reference their actual preferences, not the neighborhood's general appeal. Use "you" voice. Be concrete.`
}

export function buildDistrictNarrativePrompt(profile, district) {
  return `You are THE MAP, a knowledgeable local guide who knows this traveler well.

Traveler profile:
${profileSummary(profile)}

Neighborhood:
Name: ${district.name}
Description: ${district.description}
Hot spot: ${district.hotSpot}
Watch out: ${district.watchOut}

Write 3-4 sentences describing what a real day in ${district.name} would look like for this specific traveler. Be vivid, practical, and personal — like a local friend giving honest advice tailored to them. Address them as "you".`
}

export function buildComparisonAdvicePrompt(profile, districts) {
  const districtLines = districts.map(d =>
    `- ${d.name}: ${d.oneLineSummary} (daytime ${d.scores.daytimeLife}/10, evening ${d.scores.eveningLife}/10, ${d.scores.authenticity} vibe, ${d.scores.safety})`
  ).join('\n')

  return `You are THE MAP, an AI travel advisor.

Traveler profile:
${profileSummary(profile)}

Comparing neighborhoods:
${districtLines}

Give a decisive, direct recommendation: which neighborhood should this traveler pick and why? 2-3 sentences max. Use "you" voice. Reference their specific profile. Be confident — no "it depends."`
}

export function buildGenerateCityPrompt(cityName) {
  return `You are a travel data expert. Generate a complete, accurate neighborhood dataset for ${cityName} that a travel recommendation app will use directly.

Return ONLY a single valid JSON object — no markdown, no code fences, no explanation. Match this schema exactly:

{
  "id": "city-slug",
  "name": "City Name",
  "country": "Country Name",
  "cityType": 2,
  "cityTypology": "concentrated_walkable",
  "coverageRange": [5, 7],
  "contextualTagsAvailable": [],
  "valueMap": {},
  "districts": [
    {
      "id": "district-slug",
      "name": "District Name",
      "oneLineSummary": "One punchy sentence describing this neighborhood's core character.",
      "description": "Two to three paragraphs covering the neighborhood's vibe, what makes it distinctive, accommodation options, and what a traveler will actually experience day-to-day.",
      "hotSpot": "One concrete must-visit spot or experience.",
      "watchOut": "One honest practical warning for travelers.",
      "bookingTip": "One practical piece of booking advice.",
      "valueTypesPresent": [],
      "sacredSubTag": false,
      "scores": {
        "daytimeLife": 7,
        "eveningLife": 6,
        "clubPresence": "none",
        "proximityToAttractions": 8,
        "strategicLocation": 7,
        "pedestrianComfort": 8,
        "transportConnections": 9,
        "priceLevel": 5,
        "authenticity": "mixed",
        "safety": "safe"
      },
      "bestFor": {
        "Nester": "One sentence why this district suits or doesn't suit the Nester (wants quiet local base).",
        "Restorer": "One sentence for the Restorer (recharges in calm curated spaces).",
        "Cartographer": "One sentence for the Cartographer (strategic, well-connected, efficient).",
        "Wanderer": "One sentence for the Wanderer (lost in local life, discovery over itinerary).",
        "Atmosphere Chaser": "One sentence for the Atmosphere Chaser (real energy, not staged).",
        "Connoisseur": "One sentence for the Connoisseur (great food, energy, taste).",
        "Energizer": "One sentence for the Energizer (maximum stimulation, buzzing streets, late nights)."
      }
    }
  ]
}

Rules:
- id: lowercase, hyphens only, no spaces (e.g. "old-city", "le-marais")
- cityType: 1=Compact Monocentric, 2=Extended Monocentric, 3=Polycentric
- cityTypology: exactly one of "concentrated_walkable", "polycentric_walkable", "dispersed_car_dependent"
- contextualTagsAvailable: array containing any relevant subset of ["pilgrimage","fandom","counterculture","lgbtq"]
- valueMap: object mapping value type keys to arrays of district names that have that value
- valueTypesPresent: subset of ["historic_cultural","gastronomic","beach_coastal","nightlife","local_commerce","nature","scenic_routes"]
- All numeric scores: integers 0–10. priceLevel: 0=very expensive, 10=very cheap
- clubPresence: exactly "none", "some", or "heavy"
- authenticity: exactly "local", "mixed", or "touristy"
- safety: exactly "safe", "soft_crime", or "hard_crime"
- sacredSubTag: true only for religious/sacred districts
- Generate 5–8 real, well-known neighborhoods for ${cityName}
- Scores must reflect accurate real-world knowledge of each neighborhood
- All 7 bestFor keys required for every district`
}

export function buildAnalyzeIntentPrompt(freeText, profile) {
  return `A traveler wrote this note about their trip: "${freeText}"

Travel party: ${profile.layer2?.party ?? 'unknown'}
Existing dealbreakers: ${profile.layer3?.dealbreakers?.join(', ') || 'none'}

Extract up to 3 specific travel preferences or concerns from their note. Return ONLY a raw JSON array of short strings (5 words max each). No markdown, no explanation. Example: ["wants rooftop views","worried about noise","needs early breakfast"]. Return [] if nothing useful.`
}
