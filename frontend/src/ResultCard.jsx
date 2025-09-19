import { Alert, Link as MuiLink, Box, Typography } from '@mui/material'

export default function ResultCard({ original, shortLink, expiry, error }) {
  if (error) return <Alert severity="error">{error}</Alert>
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body2">{original}</Typography>
      <Alert severity="success" sx={{ mt: 0.5 }}>
        Short: <MuiLink href={shortLink} target="_blank" rel="noreferrer">{shortLink}</MuiLink>
        {' '}— Expires: {new Date(expiry).toLocaleString()}
      </Alert>
    </Box>
  )
}


