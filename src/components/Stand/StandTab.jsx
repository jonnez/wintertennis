import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material'
import { useGitHubData, useGitHub } from '../../hooks/useGitHub'
import { useCurrentSeason, useSundays } from '../../hooks/useSundays'
import { calculateStandings, shouldBeBold } from '../../services/rankingUtils'
import { formatDateKey } from '../../services/dateUtils'

export default function StandTab() {
  const github = useGitHub()
  const { seasonYear } = useCurrentSeason()
  const sundays = useSundays(seasonYear)
  const { data: playersData, loading: loadingPlayers } = useGitHubData(
    seasonYear ? seasonYear.toString() : null,
    'data/players.json'
  )

  const [allResults, setAllResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)

  const players = playersData?.players || []

  // Load all results for all Sundays
  useEffect(() => {
    async function loadResults() {
      if (!github || sundays.length === 0 || !seasonYear) return

      setLoadingResults(true)
      const results = []

      for (const sunday of sundays) {
        try {
          const dateKey = formatDateKey(sunday)
          const file = await github.getFile(
            seasonYear.toString(),
            `data/results-${dateKey}.json`
          )
          if (file && file.content) {
            results.push(file.content)
          }
        } catch (err) {
          // File doesn't exist, skip
        }
      }

      setAllResults(results)
      setLoadingResults(false)
    }

    loadResults()
  }, [github, sundays, seasonYear])

  if (loadingPlayers || loadingResults) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  const standings = calculateStandings(players, allResults)
  const maxGames = standings.length > 0
    ? Math.max(...standings.map(s => s.gamesPlayed))
    : 0

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Stand
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Rank</strong></TableCell>
                <TableCell><strong>Naam</strong></TableCell>
                <TableCell align="right"><strong>Gespeelde Wedstrijden</strong></TableCell>
                <TableCell align="right"><strong>Behaalde Punten</strong></TableCell>
                <TableCell align="right"><strong>Gemiddelde</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {standings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary" py={2}>
                      Nog geen resultaten beschikbaar
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                standings.map((player, index) => {
                  const isBold = shouldBeBold(player, standings)
                  return (
                    <TableRow key={player.id}>
                      <TableCell>
                        <Typography fontWeight={isBold ? 'bold' : 'normal'}>
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={isBold ? 'bold' : 'normal'}>
                          {player.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={isBold ? 'bold' : 'normal'}>
                          {player.gamesPlayed}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={isBold ? 'bold' : 'normal'}>
                          {player.totalPoints}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={isBold ? 'bold' : 'normal'}>
                          {player.average.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {standings.length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Spelers die minstens de helft van het maximum aantal gespeelde wedstrijden hebben ({Math.ceil(maxGames / 2)} van {maxGames}) worden <strong>vetgedrukt</strong> weergegeven.
        </Alert>
      )}
    </Box>
  )
}
