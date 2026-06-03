# DECISIONS — Deviations from Spec

## D-01: Strategic Location zone-proximity bonus scaling

**Spec says:** "The Strategic Location score includes a zone-proximity component weighted by Q6 priorities (1.0 / 0.5 / 0.1). Apply this BEFORE the weighted sum."

**Decision:** Implemented as: `bonus = min(2, Σ(q6Weight[vt] × 0.4) for vt in district.valueTypesPresent)`. The 0.4 scaling factor and 2-point cap were chosen to keep the bonus meaningful without overwhelming the base score on a 1–10 scale. The spec does not define the exact scale.

---

## D-02: Q6 value-type mapping

**Spec says:** Q6 lists 7 options (History & culture, Food, Beach, Nightlife, Local markets, Nature, Views) which map to value types. No explicit mapping given.

**Decision:** Mapped as: History→historic_cultural, Food→gastronomic, Beach→beach_coastal, Nightlife→nightlife, Local markets→local_commerce, Nature→nature, Views→scenic_routes. This is the natural interpretation.

---

## D-03: Date range picker not rendered

**Spec says:** Layer 3 includes a date range picker.

**Decision:** The `dates` field is included in the profile state shape but the UI uses a placeholder. MUI v5 date pickers require `@mui/x-date-pickers` as an additional dependency not listed in the original spec. Deferred to avoid adding an unlisted dependency; trivial to add in v1.1.

---

## D-04: Safety criterion display

**Spec says:** "Disqualifier (hard crime = exclude; soft crime → Watch Out)."

**Decision:** Hard crime districts are excluded from ranking (score = -Infinity, shown greyed at the bottom). Soft crime triggers a yellow Alert banner on the DistrictProfile page. No seed data includes hard_crime (Jerusalem and London are safe tourist destinations).

---

## D-05: Quiet / Family-Friendly derived display

**Spec says:** "Derived: Evening<9 AND clubs=none AND safety passes AND pedestrian≥5."

**Decision:** This is computed at ranking time and stored in `district.derived.quietFamilyFriendly`. It is currently not shown as a visible criterion bar on DistrictProfile (the 11-criteria bar would add clutter). It is available on the district object for future use (v1.1 filter chip).

---

## D-06: Contextual tag Q7 not shown for non-eligible cities

**Spec says:** "Surface only when destination supports."

**Decision:** Implemented exactly per spec — each city JSON declares `contextualTagsAvailable`, and the ModifiersIntake component conditionally renders each tag only when present in that array. LGBTQ+ is always shown (spec says "universal optional") but still requires city JSON to include "lgbtq" in contextualTagsAvailable.

---

## D-07: CompareView entry

**Spec says:** "User picks 2–3 districts via checkboxes on results page → routes here."

**Decision:** Implemented as Chip toggles on each DistrictCard in RankedResults (not checkboxes). An alert bar appears when ≥2 are selected, with a "Compare N" button that navigates to `/city/:id/compare?districts=id1,id2,id3`. This avoids the need for a separate checkbox overlay component.

---

## D-08: Custom weights re-ranking

**Spec says:** "7 sliders (one per weighted criterion), live-updating ranking preview."

**Decision:** Live preview was not implemented — clicking "Apply & re-rank" triggers re-ranking and navigates back to results. True live preview would require running rankDistricts on every slider tick, which is fast enough computationally but adds UI complexity. Deferred to v1.1.

---

## D-09: "Back" in IntakeFlow preserves answers

**Spec says:** "'Back' preserves answers."

**Decision:** Implemented via React Context + useReducer. Each step dispatches partial updates, so going back and forward preserves all answers. localStorage persistence means answers survive page refreshes too.
