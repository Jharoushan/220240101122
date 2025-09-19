import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const api = axios.create({ baseURL: apiBase, timeout: 8000 })

api.interceptors.request.use((config) => {
  // simple request id for tracing
  config.headers['x-client-id'] = 'jhar-frontend'
  return config
})

export async function makeShortUrl(payload) {
  try {
    const { data } = await api.post('/shorturls', payload)
    return { ok: true, data }
  } catch (e) {
    const reason = e.response?.data?.reason || e.response?.data?.error || e.message
    return { ok: false, reason }
  }
}

export async function getStats(code) {
  try {
    const { data } = await api.get(`/shorturls/${code}`)
    return { ok: true, data }
  } catch (e) {
    const reason = e.response?.data?.reason || e.response?.data?.error || e.message
    return { ok: false, reason }
  }
}


