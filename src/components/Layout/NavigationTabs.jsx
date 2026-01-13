import React from 'react'
import { Tabs, Tab, Box } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import SportsIcon from '@mui/icons-material/Sports'
import ScoreboardIcon from '@mui/icons-material/Scoreboard'
import PersonIcon from '@mui/icons-material/Person'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'

export default function NavigationTabs({ activeTab, setActiveTab }) {
  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="tennis planning tabs"
      >
        <Tab icon={<PeopleIcon />} label="Deelnemers" />
        <Tab icon={<SportsIcon />} label="Baanschema" />
        <Tab icon={<ScoreboardIcon />} label="Uitslag" />
        <Tab icon={<PersonIcon />} label="Spelers" />
        <Tab icon={<LeaderboardIcon />} label="Stand" />
      </Tabs>
    </Box>
  )
}
