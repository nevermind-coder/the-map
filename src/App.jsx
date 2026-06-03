import { Routes, Route, useParams } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme.js'
import { ProfileProvider } from './context/ProfileContext.jsx'
import CityPicker from './pages/CityPicker.jsx'
import CityOverview from './pages/CityOverview.jsx'
import IntakeFlow from './pages/IntakeFlow.jsx'
import RankedResults from './pages/RankedResults.jsx'
import DistrictProfile from './pages/DistrictProfile.jsx'
import CompareView from './pages/CompareView.jsx'
import CustomWeights from './pages/CustomWeights.jsx'

function CityRoutes() {
  const { id } = useParams()
  return (
    <ProfileProvider cityId={id}>
      <Routes>
        <Route index element={<CityOverview />} />
        <Route path="intake" element={<IntakeFlow />} />
        <Route path="results" element={<RankedResults />} />
        <Route path="district/:districtId" element={<DistrictProfile />} />
        <Route path="compare" element={<CompareView />} />
        <Route path="custom-weights" element={<CustomWeights />} />
      </Routes>
    </ProfileProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<CityPicker />} />
        <Route path="/city/:id/*" element={<CityRoutes />} />
      </Routes>
    </ThemeProvider>
  )
}
