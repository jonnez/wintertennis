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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import CasinoIcon from '@mui/icons-material/Casino'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { useGitHub } from '../../hooks/useGitHub'
import { useCurrentSeason, useSundays } from '../../hooks/useSundays'
import { useSharedSelectedSunday } from '../../contexts/SelectedSundayContext'
import { formatDate, formatDateKey } from '../../services/dateUtils'
import { getSchemas, getRandomSchema, generateMatches, canGenerateSchema } from '../../services/schemaGenerator'
import { orderParticipantsByRank } from '../../services/rankingUtils'

export default function BaanschemaTab() {
  const github = useGitHub()
  const { seasonYear } = useCurrentSeason()
  const sundays = useSundays(seasonYear)
  const { selectedDate, setSelectedDate } = useSharedSelectedSunday()

  const [scheduleData, setScheduleData] = useState(null)
  const [loadingSchedule, setLoadingSchedule] = useState(false)
  const [savingSchedule, setSavingSchedule] = useState(false)
  const [playersData, setPlayersData] = useState(null)
  const [allResults, setAllResults] = useState([])
  const [selectedSchema, setSelectedSchema] = useState(null)
  const [rolling, setRolling] = useState(false)
  const [imageDialog, setImageDialog] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null)

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
      const random = getRandomSchema(rankedParticipants.length)
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

  const generateSchemaImage = (SCHEMAS) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Set canvas size
    const padding = 40
    const schemaHeight = 200
    const schemaCount = Object.keys(SCHEMAS).length
    canvas.width = 800
    canvas.height = padding * 2 + schemaCount * schemaHeight + 100

    // White background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Title
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 32px Arial'
    ctx.fillText(`🎾 Baanschema's ${selectedDate ? formatDate(selectedDate, 'd MMMM') : ''}`, padding, padding + 30)

    let yOffset = padding + 80

    // Draw each schema
    Object.keys(SCHEMAS).forEach((schemaKey, index) => {
      const schema = SCHEMAS[schemaKey]

      // Schema box with color
      ctx.fillStyle = schema.color
      ctx.fillRect(padding, yOffset, canvas.width - padding * 2, schemaHeight - 20)

      // Schema title
      ctx.fillStyle = schema.textColor
      ctx.font = 'bold 24px Arial'
      ctx.fillText(`${schema.name} - ${schema.number}`, padding + 20, yOffset + 35)

      // Matches
      ctx.font = '18px Arial'
      let matchY = yOffset + 70
      schema.matches.forEach(match => {
        const team1 = match.team1.map(rank => {
          const player = rankedParticipants[rank - 1]
          return player ? player.name : `#${rank}`
        }).join(' - ')

        const team2 = match.team2.map(rank => {
          const player = rankedParticipants[rank - 1]
          return player ? player.name : `#${rank}`
        }).join(' - ')

        ctx.fillText(`Baan ${match.court}: ${team1} tegen ${team2}`, padding + 20, matchY)
        matchY += 30
      })

      yOffset += schemaHeight
    })

    return canvas
  }

  const handleSendWhatsApp = async () => {
    const SCHEMAS = getSchemas(rankedParticipants.length)

    // Detect if we're on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    try {
      const canvas = generateSchemaImage(SCHEMAS)

      // Convert canvas to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))

      // On mobile: try to share via Web Share API
      if (isMobile && navigator.share && navigator.canShare) {
        const file = new File([blob], 'baanschemas.png', { type: 'image/png' })

        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Baanschema\'s',
              text: `🎾 Baanschema's ${selectedDate ? formatDate(selectedDate, 'd MMMM') : ''}`
            })
            return
          } catch (err) {
            if (err.name === 'AbortError') {
              // User cancelled, that's okay
              return
            }
            throw err
          }
        }
      }

      // On desktop: show dialog with image for drag-and-drop
      const url = URL.createObjectURL(blob)
      setGeneratedImageUrl(url)
      setImageDialog(true)

      // Open WhatsApp Web
      window.open('https://web.whatsapp.com/', '_blank')
    } catch (err) {
      console.error('Error generating/sharing image:', err)
      alert('Fout bij maken van afbeelding. Probeer het opnieuw.')
    }
  }

  const handleCloseImageDialog = () => {
    setImageDialog(false)
    if (generatedImageUrl) {
      URL.revokeObjectURL(generatedImageUrl)
      setGeneratedImageUrl(null)
    }
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
  const SCHEMAS = getSchemas(rankedParticipants.length)

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
          Selecteer een even aantal deelnemers (4, 6, 8, 10 of 12) op de Deelnemers tab om een baanschema te kunnen maken.
          (Momenteel: {rankedParticipants.length} spelers)
        </Alert>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Kies een Baanschema
            </Typography>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                startIcon={rolling ? <CircularProgress size={20} color="inherit" /> : <CasinoIcon />}
                onClick={handleRoll}
                disabled={rolling}
              >
                {rolling ? 'Gooien...' : 'Gooi de Dobbelsteen'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<WhatsAppIcon />}
                onClick={handleSendWhatsApp}
                sx={{
                  color: '#25D366',
                  borderColor: '#25D366',
                  '&:hover': {
                    borderColor: '#128C7E',
                    backgroundColor: 'rgba(37, 211, 102, 0.04)'
                  }
                }}
              >
                Deel via WhatsApp
              </Button>
            </Box>

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

      {/* Image Dialog for drag-and-drop */}
      <Dialog
        open={imageDialog}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Sleep de afbeelding naar WhatsApp Web
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            WhatsApp Web is geopend in een nieuw venster. Sleep de onderstaande afbeelding naar een chat in WhatsApp Web.
          </Alert>
          {generatedImageUrl && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 2,
                border: '2px dashed #ccc',
                borderRadius: 2,
                backgroundColor: '#f5f5f5'
              }}
            >
              <img
                src={generatedImageUrl}
                alt="Baanschema's"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  cursor: 'grab'
                }}
                draggable={true}
              />
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            💡 Tip: Klik op de afbeelding, houd vast en sleep naar WhatsApp Web.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageDialog}>
            Sluiten
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
