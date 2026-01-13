import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { useGitHubData, useGitHub } from '../../hooks/useGitHub'
import { useCurrentSeason, useSundays, useSelectedSunday } from '../../hooks/useSundays'
import { formatDate, formatDateKey } from '../../services/dateUtils'
import { orderParticipantsByRank } from '../../services/rankingUtils'

export default function DeelnemersTab() {
  const github = useGitHub()
  const { seasonYear } = useCurrentSeason()
  const sundays = useSundays(seasonYear)
  const { selectedDate, setSelectedDate } = useSelectedSunday(sundays)

  const { data: playersData, loading: loadingPlayers } = useGitHubData(
    seasonYear.toString(),
    'data/players.json'
  )

  const [scheduleData, setScheduleData] = useState(null)
  const [loadingSchedule, setLoadingSchedule] = useState(false)
  const [savingSchedule, setSavingSchedule] = useState(false)
  const [allResults, setAllResults] = useState([])
  const [selectDialog, setSelectDialog] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const [cateringPerson, setCateringPerson] = useState(null)

  const players = playersData?.players || []
  const dateKey = selectedDate ? formatDateKey(selectedDate) : null

  // Load schedule for selected date
  useEffect(() => {
    async function loadSchedule() {
      if (!github || !dateKey) return

      setLoadingSchedule(true)
      try {
        const file = await github.getFile(
          seasonYear.toString(),
          `data/schedule-${dateKey}.json`
        )
        if (file && file.content) {
          setScheduleData(file.content)
          setSelectedParticipants(file.content.participants || [])
          setCateringPerson(file.content.cateringBy || null)
        } else {
          setScheduleData(null)
          setSelectedParticipants([])
          setCateringPerson(null)
        }
      } catch (err) {
        setScheduleData(null)
        setSelectedParticipants([])
        setCateringPerson(null)
      }
      setLoadingSchedule(false)
    }

    loadSchedule()
  }, [github, dateKey, seasonYear])

  // Load all results to calculate catering counts
  useEffect(() => {
    async function loadResults() {
      if (!github || sundays.length === 0) return

      const results = []
      for (const sunday of sundays) {
        try {
          const key = formatDateKey(sunday)
          const file = await github.getFile(
            seasonYear.toString(),
            `data/schedule-${key}.json`
          )
          if (file && file.content && file.content.cateringBy) {
            results.push({
              date: key,
              cateringBy: file.content.cateringBy
            })
          }
        } catch (err) {
          // Skip
        }
      }
      setAllResults(results)
    }

    loadResults()
  }, [github, sundays, seasonYear])

  const handleToggleParticipant = (playerId) => {
    if (selectedParticipants.includes(playerId)) {
      setSelectedParticipants(selectedParticipants.filter(id => id !== playerId))
    } else {
      setSelectedParticipants([...selectedParticipants, playerId])
    }
  }

  const handleSave = async () => {
    if (!github || !dateKey) return

    setSavingSchedule(true)
    try {
      const newSchedule = {
        date: dateKey,
        participants: selectedParticipants,
        selectedSchema: scheduleData?.selectedSchema || null,
        cateringBy: cateringPerson
      }

      await github.saveFile(
        seasonYear.toString(),
        `data/schedule-${dateKey}.json`,
        newSchedule,
        `Update deelnemers voor ${dateKey}`,
        scheduleData ? undefined : null
      )

      setScheduleData(newSchedule)
      setSelectDialog(false)
    } catch (err) {
      alert('Fout bij opslaan: ' + err.message)
    }
    setSavingSchedule(false)
  }

  const getCateringCount = (playerId) => {
    return allResults.filter(r => r.cateringBy === playerId).length
  }

  if (!selectedDate) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  const rankedParticipants = orderParticipantsByRank(selectedParticipants, players, allResults)

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Deelnemers
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
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                {rankedParticipants.length} van 12 spelers
              </Typography>
              <Button
                variant="contained"
                onClick={() => setSelectDialog(true)}
                disabled={loadingPlayers}
              >
                Deelnemers Selecteren
              </Button>
            </Box>

            {rankedParticipants.length === 0 ? (
              <Alert severity="info">
                Nog geen deelnemers geselecteerd voor deze zondag
              </Alert>
            ) : (
              <List>
                {rankedParticipants.map((participant, index) => {
                  const cateringCount = getCateringCount(participant.id)
                  const isDoingCatering = cateringPerson === participant.id

                  return (
                    <ListItem
                      key={participant.id}
                      sx={{
                        borderBottom: '1px solid #eee',
                        '&:last-child': { borderBottom: 'none' }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={index + 1}
                              size="small"
                              color="primary"
                              sx={{ minWidth: 32 }}
                            />
                            <Typography>{participant.name}</Typography>
                            {[...Array(cateringCount)].map((_, i) => (
                              <RestaurantIcon key={i} fontSize="small" color="action" />
                            ))}
                          </Box>
                        }
                      />
                      <Checkbox
                        checked={isDoingCatering}
                        onChange={() => {
                          if (isDoingCatering) {
                            setCateringPerson(null)
                          } else {
                            setCateringPerson(participant.id)
                          }
                        }}
                        title="Verzorgt catering deze week"
                      />
                    </ListItem>
                  )
                })}
              </List>
            )}

            {rankedParticipants.length > 0 && (
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={savingSchedule}
                sx={{ mt: 2 }}
                fullWidth
              >
                {savingSchedule ? <CircularProgress size={24} /> : 'Opslaan'}
              </Button>
            )}
          </Paper>

          <Alert severity="info">
            Het <RestaurantIcon fontSize="small" sx={{ verticalAlign: 'middle' }} /> icon geeft aan hoe vaak deze speler al catering heeft verzorgd.
            Vink de checkbox aan om iemand aan te wijzen voor catering deze week.
          </Alert>
        </>
      )}

      {/* Participant Selection Dialog */}
      <Dialog
        open={selectDialog}
        onClose={() => setSelectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Selecteer Deelnemers voor {selectedDate && formatDate(selectedDate)}</DialogTitle>
        <DialogContent>
          <List>
            {players.map(player => (
              <ListItem key={player.id}>
                <Checkbox
                  checked={selectedParticipants.includes(player.id)}
                  onChange={() => handleToggleParticipant(player.id)}
                />
                <ListItemText
                  primary={player.name}
                  secondary={player.frequency === 'elke_week' ? 'Elke week' :
                    player.frequency === 'even_weken' ? 'Even weken' :
                    player.frequency === 'oneven_weken' ? 'Oneven weken' : 'Invaller'}
                />
              </ListItem>
            ))}
          </List>
          {selectedParticipants.length !== 12 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Selecteer exact 12 spelers voor de baanschema's
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectDialog(false)}>Annuleren</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={savingSchedule || selectedParticipants.length === 0}
          >
            Opslaan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
