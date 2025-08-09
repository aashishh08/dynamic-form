import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { CssBaseline, Container } from '@mui/material'
import App from './App'
import { store } from './store'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CssBaseline />
        <Container sx={{ py: 3 }}>
          <App />
        </Container>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
