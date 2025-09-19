import { useEffect, useState } from 'react'
import { Box, TextField, Button, Typography, Alert, Stack, List, ListItem, ListItemText, Divider } from '@mui/material'
import { getStats } from './api'

export default function Stats({ recent = [] }) {
  const [code, setCode] = useState(recent[0] || '')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

  useEffect(() => {
    if (recent.length && !code) setCode(recent[0])
  }, [recent])

  const fetchStats = async () => {
    setError(''); setData(null)
    if (!code) { setError('Enter a shortcode'); return }
    const res = await getStats(code)
    if (res.ok) setData(res.data)
    else setError(res.reason || 'Failed to fetch')
  }

  return (
    <Stack spacing={2}>
      <Box>
        <TextField label="Shortcode" value={code} onChange={(e)=>setCode(e.target.value)} sx={{ mr: 2 }} />
        <Button variant="contained" onClick={fetchStats}>Get Stats</Button>
      </Box>
      {recent.length>0 && (
        <Typography variant="body2">Recent: {recent.join(', ')}</Typography>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {data && (
        <Box>
          <Typography variant="h6">{data.originalUrl}</Typography>
          <Typography variant="body2">Created: {new Date(data.createdAt).toLocaleString()}</Typography>
          <Typography variant="body2">Expiry: {new Date(data.expiry).toLocaleString()}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Total clicks: {data.totalClicks}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Click log</Typography>
          <List>
            {data.clicks.map((c, i) => (
              <ListItem key={i} dense>
                <ListItemText
                  primary={`${new Date(c.timestamp).toLocaleString()} — ${c.region || 'Unknown'}`}
                  secondary={c.source || 'direct'}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Stack>
  )
}




