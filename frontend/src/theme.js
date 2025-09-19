import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#6c5ce7' },
    secondary: { main: '#ff7675' }
  },
  shape: { borderRadius: 10 },
  typography: {
    fontSize: 14,
    h4: { fontWeight: 700, letterSpacing: 0.2 },
    button: { textTransform: 'none', fontWeight: 600 }
  }
})


