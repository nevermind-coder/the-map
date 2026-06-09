import { Box, Typography, CircularProgress, Skeleton } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

export default function AiInsight({ text, loading, error, label = 'Gemini' }) {
  if (error || (!loading && !text)) return null

  return (
    <Box sx={{
      mt: 2, px: 2, py: 1.5,
      bgcolor: 'rgba(99, 102, 241, 0.05)',
      border: '1px solid rgba(99, 102, 241, 0.18)',
      borderRadius: 2,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
        <AutoAwesomeIcon sx={{ fontSize: 13, color: '#6366f1' }} />
        <Typography variant="overline" sx={{ fontSize: '0.62rem', letterSpacing: 1, color: '#6366f1', lineHeight: 1 }}>
          {label}
        </Typography>
        {loading && <CircularProgress size={9} sx={{ ml: 0.5, color: '#6366f1' }} />}
      </Box>

      {loading && !text ? (
        <Box>
          <Skeleton variant="text" width="90%" sx={{ fontSize: '0.85rem' }} />
          <Skeleton variant="text" width="72%" sx={{ fontSize: '0.85rem' }} />
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {text}
          {loading && <span style={{ opacity: 0.35 }}>▌</span>}
        </Typography>
      )}
    </Box>
  )
}
