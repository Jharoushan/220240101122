import { useMemo, useState } from 'react'
import { Box, Tabs, Tab, Typography, Link as MuiLink, Alert, AppBar, Toolbar, Paper } from '@mui/material'
import Shortener from './Shortener'
import Stats from './Stats'

export default function App() {
  const [tab, setTab] = useState(0)
  const [lastCodes, setLastCodes] = useState([])

  const handleCreated = (codes) => {
    setLastCodes((prev) => Array.from(new Set([...codes, ...prev])).slice(0, 10))
  }

  const baseUrl = useMemo(() => import.meta.env.VITE_API_BASE || 'http://localhost:4000', [])

  return (
    <Box sx={{ py: 0 }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>URL Shortener</Typography>
          <Typography variant="body2">API: {baseUrl}</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 3 }}>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Make Links" />
            <Tab label="Link Insights" />
          </Tabs>
        </Paper>
        <Paper elevation={1} sx={{ p: 2 }}>
          {tab === 0 && <Shortener onCreated={handleCreated} />}
          {tab === 1 && <Stats recent={lastCodes} />}
        </Paper>
      </Box>
    </Box>
  )
}




