import React, { useEffect } from 'react'
import { Box, Button, Paper, Typography, Alert } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useAuth } from './AuthContext'

// OAuth config - update these after creating GitHub OAuth App
const CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID'
const REDIRECT_URI = window.location.origin + '/wintertennis/callback'

export default function GitHubAuth() {
  const { login, isAuthenticated, user } = useAuth()

  useEffect(() => {
    // Handle OAuth callback
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code && !isAuthenticated) {
      // In een productie omgeving zou je de code naar een backend sturen
      // die deze exchange voor een access token. Voor demo purposes
      // kun je tijdelijk een personal access token gebruiken.
      console.log('OAuth code received:', code)

      // TODO: Exchange code for token via backend/proxy
    }
  }, [isAuthenticated, login])

  const handleLogin = () => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`
    window.location.href = authUrl
  }

  const handleTokenLogin = () => {
    const token = prompt('Voer je GitHub Personal Access Token in (met repo scope):')
    if (token) {
      login(token)
    }
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 500,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          🎾 Winter Tennis Planning
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Log in met GitHub om de tennis planning te gebruiken.
          De data wordt opgeslagen in je GitHub repository.
        </Typography>

        <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
          <strong>Setup vereist:</strong><br />
          1. Maak een GitHub OAuth App aan<br />
          2. Of gebruik een Personal Access Token (tijdelijk voor demo)
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<GitHubIcon />}
            onClick={handleLogin}
            disabled={CLIENT_ID === 'YOUR_GITHUB_CLIENT_ID'}
          >
            Login met GitHub OAuth
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={handleTokenLogin}
          >
            Login met Personal Access Token
          </Button>
        </Box>

        <Typography variant="caption" sx={{ mt: 3, display: 'block', color: 'text.secondary' }}>
          Je token wordt alleen lokaal opgeslagen in je browser
        </Typography>
      </Paper>
    </Box>
  )
}
