import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function ScenarioCard({ option, selected, onSelect }) {
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5,
        border: selected ? '2px solid' : '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'primary.50' : 'background.paper',
        transition: 'all 0.15s ease',
      }}
    >
      <CardActionArea onClick={() => onSelect(option.value)}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={selected ? 600 : 400}>
              {option.label}
            </Typography>
          </Box>
          {selected && (
            <CheckCircleIcon color="primary" sx={{ flexShrink: 0 }} />
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
