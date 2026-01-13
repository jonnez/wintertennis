import { useState } from 'react'
import { Container, Box, Typography } from '@mui/material'
import AppLayout from './components/Layout/AppLayout'
import { AuthProvider } from './components/Auth/AuthContext'

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  )
}

export default App
