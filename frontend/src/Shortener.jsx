import { useState } from 'react'
import { Box, Grid, TextField, Button, Typography, Alert, Stack } from '@mui/material'
import ResultCard from './ResultCard'
import { makeShortUrl } from './api'

function emptyRow() {
  return { url: '', validity: 30, shortcode: '' }
}

export default function Shortener({ onCreated }) {
  const [rows, setRows] = useState([emptyRow()])
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const api = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

  const validateRow = (r) => {
    try {
      const u = new URL(r.url)
      if (!u.protocol.startsWith('http')) return false
      if (r.validity !== '' && Number.isNaN(Number(r.validity))) return false
      if (r.shortcode && /[^a-zA-Z0-9]/.test(r.shortcode)) return false
      return true
    } catch {
      return false
    }
  }

  const addRow = () => {
    if (rows.length >= 5) return
    setRows([...rows, emptyRow()])
  }

  const updateRow = (i, key, val) => {
    const next = rows.slice()
    next[i] = { ...next[i], [key]: val }
    setRows(next)
  }

  const submit = async () => {
    setError('')
    const valid = rows.filter(r => r.url.trim())
    if (valid.length === 0) {
      setError('Please enter at least one URL')
      return
    }
    for (const r of valid) {
      if (!validateRow(r)) {
        setError('Fix validation errors (valid URL, integer validity, alphanumeric shortcode)')
        return
      }
    }
    const created = []
    const outputs = []
    for (const r of valid) {
      const res = await makeShortUrl({
        url: r.url,
        validity: r.validity === '' ? 30 : Number(r.validity),
        shortcode: r.shortcode || undefined
      })
      if (res.ok) {
        outputs.push({ original: r.url, ...res.data })
        const code = res.data.shortLink.split('/').pop()
        created.push(code)
      } else {
        outputs.push({ original: r.url, error: res.reason || 'Failed' })
      }
    }
    setResults(outputs)
    onCreated?.(created)
  }

  return (
    <Box>
      <Stack spacing={2}>
        {rows.map((r, i) => (
          <Grid container spacing={2} key={i}>
            <Grid item xs={12} md={7}>
              <TextField label="Original URL" fullWidth value={r.url} onChange={(e)=>updateRow(i,'url',e.target.value)} />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField label="Validity (min)" fullWidth value={r.validity} onChange={(e)=>updateRow(i,'validity',e.target.value)} />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField label="Shortcode (opt)" fullWidth value={r.shortcode} onChange={(e)=>updateRow(i,'shortcode',e.target.value)} />
            </Grid>
            {i === 0 && (
              <Grid item xs={12} md={1}>
                <Button fullWidth variant="outlined" onClick={addRow} disabled={rows.length>=5}>+Add</Button>
              </Grid>
            )}
          </Grid>
        ))}
        <Box>
          <Button variant="contained" onClick={submit}>Create Short Links</Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {results.length>0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Results</Typography>
            {results.map((r, idx) => (
              <ResultCard key={idx} {...r} />
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  )
}




