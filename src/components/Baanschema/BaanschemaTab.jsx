import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material'
import CasinoIcon from '@mui/icons-material/Casino'
import { useGitHub } from '../../hooks/useGitHub'
import { useCurrentSeason, useSundays, useSelectedSunday } from '../../hooks/useSundays'
import { formatDate, formatDateKey } from '../../services/dateUtils'
import { SCHEMAS, getRandomSchema, generateMatches, canGenerateSchema } from '../../services/schemaGenerator'
import { orderParticipantsByRank } from '../../services/rankingUtils'

export default function BaanschemaTab() {
  const github = useGitHub()
  const { seasonYear } = useCurrentSeason()
  const sundays = useSundays(seasonYear)
  const { selectedDate, setSelectedDate } = useSelectedSunday(sundays)

  const [scheduleData, setScheduleData] = useState(null)
  const [loadingSchedule, setLoadingSchedule] = useState(false)
  const [savingSchedule, setSavingSchedule] = useState(false)
  const [playersData, setPlayersData] = useState(null)
  const [allResults, setAllResults] = useState([])
  const [selectedSchema, setSelectedSchema] = useState(null)
  const [rolling, setRolling] = useState(false)

  const dateKey = selectedDate ? formatDateKey(selectedDate) : null
  const players = playersData?.players || []

  // Load players
  useEffect(() => {
    async function loadPlayers() {
      if (!github || !seasonYear) return

      try {
        const file = await github.getFile(seasonYear.toString(), 'data/players.json')
        if (file && file.content) {
          setPlayersData(file.content)
        }
      } catch (err) {
        console.error('Error loading players:', err)
      }
    }

    loadPlayers()
  }, [github, seasonYear])

  // Load schedule for selected date
  useEffect(() => {
    async function loadSchedule() {
      if (!github || !dateKey || !seasonYear) return

      setLoadingSchedule(true)
      try {
        const file = await github.getFile(
          seasonYear.toString(),
          `data/schedule-${dateKey}.json`
        )
        if (file && file.content) {
          setScheduleData(file.content)
          setSelectedSchema(file.content.selectedSchema)
        } else {
          setScheduleData(null)
          setSelectedSchema(null)
        }
      } catch (err) {
        setScheduleData(null)
        setSelectedSchema(null)
      }
      setLoadingSchedule(false)
    }

    loadSchedule()
  }, [github, dateKey, seasonYear])

  // Load all results for ranking
  useEffect(() => {
    async function loadResults() {
      if (!github || sundays.length === 0 || !seasonYear) return

      const results = []
      for (const sunday of sundays) {
        try {
          const key = formatDateKey(sunday)
          const file = await github.getFile(
            seasonYear.toString(),
            `data/results-${key}.json`
          )
          if (file && file.content) {
            results.push(file.content)
          }
        } catch (err) {
          // Skip
        }
      }
      setAllResults(results)
    }

    loadResults()
  }, [github, sundays, seasonYear])

  const handleRoll = () => {
    setRolling(true)
    setTimeout(() => {
      const random = getRandomSchema()
      setSelectedSchema(random)
      setRolling(false)
    }, 500)
  }

  const handleSave = async () => {
    if (!github || !dateKey || !selectedSchema || !seasonYear) return

    setSavingSchedule(true)
    try {
      const newSchedule = {
        ...scheduleData,
        date: dateKey,
        selectedSchema
      }

      await github.saveFile(
        seasonYear.toString(),
        `data/schedule-${dateKey}.json`,
        newSchedule,
        `Update baanschema voor ${dateKey}`,
        scheduleData ? undefined : null
      )

      setScheduleData(newSchedule)
      alert('Baanschema opgeslagen!')
    } catch (err) {
      alert('Fout bij opslaan: ' + err.message)
    }
    setSavingSchedule(false)
  }

  if (!selectedDate) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  const participants = scheduleData?.participants || []
  const rankedParticipants = orderParticipantsByRank(participants, players, allResults)
  const canGenerate = canGenerateSchema(rankedParticipants)

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Baanschema
        </Typography>
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Selecteer Zondag</InputLabel>
        <Select
          value={selectedDate ? selectedDate.getTime() : ''}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          label="Selecteer Zondag"
        >
          {sundays.map(sunday => (
            <MenuItem key={sunday.getTime()} value={sunday.getTime()}>
              {formatDate(sunday)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loadingSchedule ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : !canGenerate ? (
        <Alert severity="warning">
          Selecteer eerst exact 12 deelnemers op de Deelnemers tab om een baanschema te kunnen maken.
          (Momenteel: {rankedParticipants.length} spelers)
        </Alert>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Kies een Baanschema
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={rolling ? <CircularProgress size={20} color="inherit" /> : <CasinoIcon />}
              onClick={handleRoll}
              disabled={rolling}
              sx={{ mb: 2 }}
            >
              {rolling ? 'Gooien...' : 'Gooi de Dobbelsteen'}
            </Button>

            {selectedSchema && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Geselecteerd: <strong>{SCHEMAS[selectedSchema].name}</strong> (Schema {SCHEMAS[selectedSchema].number})
              </Alert>
            )}
          </Paper>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {Object.keys(SCHEMAS).map(schemaKey => {
              const schema = SCHEMAS[schemaKey]
              const isSelected = selectedSchema === schemaKey

              return (
                <Grid item xs={12} sm={6} md={4} key={schemaKey}>
                  <Card
                    sx={{
                      backgroundColor: schema.color,
                      color: schema.textColor,
                      border: isSelected ? '3px solid #1976d2' : 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 6
                      }
                    }}
                    onClick={() => setSelectedSchema(schemaKey)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {schema.name} - {schema.number}
                      </Typography>
                      {schema.matches.map(match => {
                        const team1 = match.team1.map(rank => {
                          const player = rankedParticipants[rank - 1]
                          return player ? player.name : `#${rank}`
                        }).join(' - ')

                        const team2 = match.team2.map(rank => {
                          const player = rankedParticipants[rank - 1]
                          return player ? player.name : `#${rank}`
                        }).join(' - ')

                        return (
                          <Box key={match.court} sx={{ mb: 1, fontSize: '0.9em' }}>
                            <strong>Baan {match.court}:</strong><br />
                            {team1} <strong>tegen</strong> {team2}
                          </Box>
                        )
                      })}
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>

          {selectedSchema && (
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={savingSchedule}
              fullWidth
            >
              {savingSchedule ? <CircularProgress size={24} /> : 'Schema Opslaan'}
            </Button>
          )}
        </>
      )}
    </Box>
  )
}
