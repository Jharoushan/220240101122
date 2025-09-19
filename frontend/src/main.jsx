import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, Container, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <App />
      </Container>
    </ThemeProvider>
  </React.StrictMode>
)




