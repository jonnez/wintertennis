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
  CircularProgress,
  Alert,
  TextField,
  Grid,
  Card,
  CardContent
} from '@mui/material'
import { useGitHub } from '../../hooks/useGitHub'
import { useCurrentSeason, useSundays } from '../../hooks/useSundays'
import { useSharedSelectedSunday } from '../../contexts/SelectedSundayContext'
import { formatDate, formatDateKey } from '../../services/dateUtils'
import { getSchemas, generateMatches } from '../../services/schemaGenerator'
import { orderParticipantsByRank } from '../../services/rankingUtils'

export default function UitslagTab() {
  const github = useGitHub()
  const { seasonYear } = useCurrentSeason()
  const sundays = useSundays(seasonYear)
  const { selectedDate, setSelectedDate } = useSharedSelectedSunday()

  const [scheduleData, setScheduleData] = useState(null)
  const [resultsData, setResultsData] = useState(null)
  const [loadingSchedule, setLoadingSchedule] = useState(false)
  const [loadingResults, setLoadingResults] = useState(false)
  const [savingResults, setSavingResults] = useState(false)
  const [playersData, setPlayersData] = useState(null)
  const [allResults, setAllResults] = useState([])
  const [matches, setMatches] = useState([])

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

  // Load all results for ranking
  useEffect(() => {
    async function loadAllResults() {
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

    loadAllResults()
  }, [github, sundays, seasonYear])

  // Load schedule and results for selected date
  useEffect(() => {
    async function loadData() {
      if (!github || !dateKey || !seasonYear) return

      setLoadingSchedule(true)
      setLoadingResults(true)

      try {
        const scheduleFile = await github.getFile(
          seasonYear.toString(),
          `data/schedule-${dateKey}.json`
        )
        if (scheduleFile && scheduleFile.content) {
          setScheduleData(scheduleFile.content)
        } else {
          setScheduleData(null)
        }
      } catch (err) {
        setScheduleData(null)
      }

      try {
        const resultsFile = await github.getFile(
          seasonYear.toString(),
          `data/results-${dateKey}.json`
        )
        if (resultsFile && resultsFile.content) {
          setResultsData(resultsFile.content)
          setMatches(resultsFile.content.matches || [])
        } else {
          setResultsData(null)
          setMatches([])
        }
      } catch (err) {
        setResultsData(null)
        setMatches([])
      }

      setLoadingSchedule(false)
      setLoadingResults(false)
    }

    loadData()
  }, [github, dateKey, seasonYear])

  // Generate initial matches from schedule
  useEffect(() => {
    if (scheduleData && matches.length === 0 && scheduleData.selectedSchema) {
      const participants = scheduleData.participants || []
      const rankedParticipants = orderParticipantsByRank(participants, players, allResults)

      if (rankedParticipants.length >= 4 && rankedParticipants.length <= 12 && rankedParticipants.length % 2 === 0) {
        const SCHEMAS = getSchemas(rankedParticipants.length)
        const schema = SCHEMAS[scheduleData.selectedSchema]
        if (schema) {
          const generatedMatches = schema.matches.map(match => {
            const getPlayer = (rank) => {
              const index = rank - 1
              return rankedParticipants[index] ? rankedParticipants[index].id : null
            }

            return {
              court: match.court,
              team1: {
                players: match.team1.map(getPlayer).filter(Boolean),
                points: 0
              },
              team2: {
                players: match.team2.map(getPlayer).filter(Boolean),
                points: 0
              }
            }
          })

          setMatches(generatedMatches)
        }
      }
    }
  }, [scheduleData, players, allResults, matches.length])

  const handlePointsChange = (matchIndex, team, points) => {
    const newMatches = [...matches]
    newMatches[matchIndex][team].points = Math.max(0, Math.min(2, parseInt(points) || 0))
    setMatches(newMatches)
  }

  const handleSave = async () => {
    if (!github || !dateKey || !seasonYear) return

    // Validate total points
    const isValid = matches.every(match => {
      const total = match.team1.points + match.team2.points
      return total === 2
    })

    if (!isValid) {
      alert('Elk team moet samen 2 punten hebben (0-2, 1-1, of 2-0)')
      return
    }

    setSavingResults(true)
    try {
      const newResults = {
        date: dateKey,
        matches
      }

      await github.saveFile(
        seasonYear.toString(),
        `data/results-${dateKey}.json`,
        newResults,
        `Update uitslagen voor ${dateKey}`,
        resultsData ? undefined : null
      )

      setResultsData(newResults)
      alert('Uitslagen opgeslagen!')
    } catch (err) {
      alert('Fout bij opslaan: ' + err.message)
    }
    setSavingResults(false)
  }

  const getPlayerName = (playerId) => {
    const player = players.find(p => p.id === playerId)
    return player ? player.name : '???'
  }

  if (!selectedDate) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (loadingSchedule || loadingResults) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (!scheduleData || !scheduleData.selectedSchema) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Uitslag
        </Typography>

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

        <Alert severity="warning">
          Selecteer eerst deelnemers en een baanschema op de vorige tabs
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Uitslag
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

      <Alert severity="info" sx={{ mb: 3 }}>
        Geselecteerd schema: <strong>{(() => {
          const participants = scheduleData.participants || []
          const rankedParticipants = orderParticipantsByRank(participants, players, allResults)
          const SCHEMAS = getSchemas(rankedParticipants.length)
          return SCHEMAS[scheduleData.selectedSchema]?.name
        })()}</strong>
        <br />
        Voer de punten in (0, 1, of 2 per team). Totaal per wedstrijd moet 2 zijn.
      </Alert>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {matches.map((match, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Baan {match.court}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Team 1:</Typography>
                  <Typography>
                    {match.team1.players.map(getPlayerName).join(' - ')}
                  </Typography>
                  <TextField
                    type="number"
                    label="Punten"
                    value={match.team1.points}
                    onChange={(e) => handlePointsChange(index, 'team1', e.target.value)}
                    inputProps={{ min: 0, max: 2 }}
                    sx={{ mt: 1, width: 100 }}
                  />
                </Box>

                <Typography variant="body2" align="center" sx={{ my: 1 }}>
                  <strong>TEGEN</strong>
                </Typography>

                <Box>
                  <Typography variant="subtitle2">Team 2:</Typography>
                  <Typography>
                    {match.team2.players.map(getPlayerName).join(' - ')}
                  </Typography>
                  <TextField
                    type="number"
                    label="Punten"
                    value={match.team2.points}
                    onChange={(e) => handlePointsChange(index, 'team2', e.target.value)}
                    inputProps={{ min: 0, max: 2 }}
                    sx={{ mt: 1, width: 100 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        size="large"
        onClick={handleSave}
        disabled={savingResults}
        fullWidth
      >
        {savingResults ? <CircularProgress size={24} /> : 'Uitslagen Opslaan'}
      </Button>
    </Box>
  )
}
