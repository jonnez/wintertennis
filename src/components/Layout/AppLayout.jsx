import React, { useState } from 'react'
import { Box, AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../Auth/AuthContext'
import GitHubAuth from '../Auth/GitHubAuth'
import NavigationTabs from './NavigationTabs'
import DeelnemersTab from '../Deelnemers/DeelnemersTab'
import BaanschemaTab from '../Baanschema/BaanschemaTab'
import UitslagTab from '../Uitslag/UitslagTab'
import SpelersTab from '../Spelers/SpelersTab'
import StandTab from '../Stand/StandTab'
import { SelectedSundayProvider } from '../../contexts/SelectedSundayContext'
import { useCurrentSeason, useSundays } from '../../hooks/useSundays'

export default function AppLayout() {
  const { isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const { seasonYear } = useCurrentSeason()
  const sundays = useSundays(seasonYear)

  if (!isAuthenticated) {
    return <GitHubAuth />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <DeelnemersTab />
      case 1:
        return <BaanschemaTab />
      case 2:
        return <UitslagTab />
      case 3:
        return <SpelersTab />
      case 4:
        return <StandTab />
      default:
        return <DeelnemersTab />
    }
  }

  return (
    <SelectedSundayProvider sundays={sundays}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🎾 Winter Tennis Planning
            </Typography>
            <IconButton color="inherit" onClick={logout} title="Uitloggen">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <Box sx={{ flexGrow: 1, padding: 3 }}>
          {renderTabContent()}
        </Box>
      </Box>
    </SelectedSundayProvider>
  )
}
