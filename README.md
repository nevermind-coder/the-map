# THE MAP — Accommodation Stage (v1)

A neighborhood recommendation engine for travelers. You answer 6 attitudinal questions, describe your group and constraints, and the app ranks every neighborhood in a city by how well it fits your specific traveler profile.

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 85 unit tests (Vitest)
npm run build    # production build
```

## Adding a new city

Create `src/data/cities/<city-id>.json` following this schema:

```jsonc
{
  "id": "city-id",
  "name": "City Name",
  "country": "Country",
  "cityType": 2,                 // 1-4: Compact Mono / Extended Mono / Polycentric / Extreme Poly
  "cityTypology": "concentrated_walkable",  // or polycentric_walkable / dispersed_car_dependent
  "coverageRange": [5, 7],
  "valueMap": { "historic_cultural": ["District A"] },
  "contextualTagsAvailable": ["pilgrimage", "lgbtq"],
  "districts": [
    {
      "id": "district-id",
      "name": "District Name",
      "oneLineSummary": "One sentence.",
      "description": "3-5 sentences.",
      "hotSpot": "...",
      "watchOut": "...",
      "bookingTip": "...",
      "valueTypesPresent": ["historic_cultural"],
      "sacredSubTag": true,
      "scores": {
        "daytimeLife": 8,          // 1-10
        "eveningLife": 7,          // 1-10
        "clubPresence": "none",    // none / some / heavy
        "proximityToAttractions": 9,
        "strategicLocation": 8,
        "pedestrianComfort": 8,
        "transportConnections": 9,
        "priceLevel": 5,           // 1-10, 10 = cheapest
        "authenticity": "mixed",   // touristy / mixed / local
        "safety": "safe"           // safe / soft_crime / hard_crime
      },
      "bestFor": {
        "Nester": "...", "Restorer": "...", "Cartographer": "...",
        "Wanderer": "...", "Atmosphere Chaser": "...", "Connoisseur": "...", "Energizer": "..."
      }
    }
  ]
}
```

Then register it in `src/data/index.js`:

```js
import myCity from './cities/my-city.json'
export const CITIES = [jerusalem, london, myCity]
```

## How composition logic flows

1. **Layer 1 intake** collects Q1–Q4 (two desire/behavior pairs) and Q6 (value-type priorities).
2. **composeAxisA/B** (`src/profile/composeAxis.js`) resolves each pair: both must agree on a pole to get ±1; any mixed input or disagreement → 0.
3. **computeWeights** (`src/engine/composition.js`) applies: `Raw(C) = Base(C) + AxisA×A_coeff + AxisB×B_coeff`, floors at 1, normalizes to 100%.
4. **projectPersona** maps the 2D cell (e.g., SI → Atmosphere Chaser) to one of 7 personas that drives result copy.
5. **rankDistricts** (`src/engine/rankDistricts.js`):
   - Applies car-dependent transport cap (7%) if city is `dispersed_car_dependent`
   - Adjusts each district's strategic location score via Q6 value-type weights
   - Multiplies district numeric scores by normalized weights
   - Applies authenticity + club-presence filter adjustments (post weighted sum)
   - Hard-disqualifies heavy-club districts for Restorative travelers (axisA = -1)
   - Sorts qualified by score descending; disqualified go to the bottom

## Open items not in v1

- Map view (placeholder shown)
- Drive-time scoring for `dispersed_car_dependent` cities (engine supports it; LA data deferred)
- User-fit confidence score (deferred to v1.6 per spec)
- Audio-guide tone generation
- Stages 1, 2, 4, 5, 6 of the broader product
- Booking integrations / backend / auth
- Date-range picker in Layer 3
- Live-updating ranking preview on CustomWeights
- Code splitting (MUI bundle is large)
