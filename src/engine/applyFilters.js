export function applyFilters(district, axisA, axisB) {
  const { authenticity, clubPresence } = district.scores
  let adjustment = 0
  let hardDisqualified = false

  // Authenticity (Axis B driven: Immersive = -1)
  if (axisB === -1) {
    if (authenticity === 'local') adjustment += 0.7
    else if (authenticity === 'mixed') adjustment += 0.1
    else if (authenticity === 'touristy') adjustment -= 0.7
  }

  // Club presence (Axis A driven: Restorative = -1, Stimulating = +1)
  if (clubPresence === 'heavy') {
    if (axisA === -1) {
      hardDisqualified = true
    } else if (axisA === 0) {
      adjustment -= 0.4
    } else {
      adjustment += 0.3
    }
  } else if (clubPresence === 'some') {
    if (axisA === -1) adjustment -= 0.4
    else if (axisA === 1) adjustment += 0.1
  }

  return { adjustment, hardDisqualified }
}
