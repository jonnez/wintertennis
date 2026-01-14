import React, { useState } from 'react'
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
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { v4 as uuidv4 } from 'uuid'
import { useGitHubData } from '../../hooks/useGitHub'
import { useCurrentSeason } from '../../hooks/useSundays'

const FREQUENCY_OPTIONS = [
  { value: 'elke_week', label: 'Elke week' },
  { value: 'even_weken', label: 'Even weken' },
  { value: 'oneven_weken', label: 'Oneven weken' },
  { value: 'invaller', label: 'Invaller' }
]

export default function SpelersTab() {
  const { seasonYear } = useCurrentSeason()
  const { data: playersData, loading, error, save } = useGitHubData(
    seasonYear ? seasonYear.toString() : null,
    'data/players.json'
  )

  const [editDialog, setEditDialog] = useState({ open: false, player: null })
  const [addDialog, setAddDialog] = useState(false)
  const [newPlayer, setNewPlayer] = useState({ name: '', frequency: 'elke_week' })

  const players = playersData?.players || []

  const handleAdd = async () => {
    if (!newPlayer.name.trim()) return

    const player = {
      id: uuidv4(),
      name: newPlayer.name.trim(),
      frequency: newPlayer.frequency
    }

    const updated = {
      players: [...players, player]
    }

    const success = await save(updated, `Speler toegevoegd: ${player.name}`)
    if (success) {
      setAddDialog(false)
      setNewPlayer({ name: '', frequency: 'elke_week' })
    }
  }

  const handleEdit = async () => {
    if (!editDialog.player || !editDialog.player.name.trim()) return

    const updated = {
      players: players.map(p =>
        p.id === editDialog.player.id ? editDialog.player : p
      )
    }

    const success = await save(updated, `Speler gewijzigd: ${editDialog.player.name}`)
    if (success) {
      setEditDialog({ open: false, player: null })
    }
  }

  const handleDelete = async (player) => {
    if (!confirm(`Weet je zeker dat je ${player.name} wilt verwijderen?`)) {
      return
    }

    const updated = {
      players: players.filter(p => p.id !== player.id)
    }

    await save(updated, `Speler verwijderd: ${player.name}`)
  }

  if (loading && !playersData) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Fout bij laden van spelers: {error}
      </Alert>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Spelers Beheer
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialog(true)}
        >
          Speler Toevoegen
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Naam</strong></TableCell>
              <TableCell><strong>Frequentie</strong></TableCell>
              <TableCell align="right"><strong>Acties</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="text.secondary" py={2}>
                    Nog geen spelers toegevoegd
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              players.map(player => (
                <TableRow key={player.id}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>
                    {FREQUENCY_OPTIONS.find(f => f.value === player.frequency)?.label}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => setEditDialog({ open: true, player: { ...player } })}
                      title="Bewerken"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(player)}
                      color="error"
                      title="Verwijderen"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Dialog */}
      <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Speler Toevoegen</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Naam"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
              fullWidth
              autoFocus
            />
            <Select
              value={newPlayer.frequency}
              onChange={(e) => setNewPlayer({ ...newPlayer, frequency: e.target.value })}
              fullWidth
            >
              {FREQUENCY_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog(false)}>Annuleren</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!newPlayer.name.trim()}>
            Toevoegen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, player: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Speler Bewerken</DialogTitle>
        <DialogContent>
          {editDialog.player && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Naam"
                value={editDialog.player.name}
                onChange={(e) => setEditDialog({
                  ...editDialog,
                  player: { ...editDialog.player, name: e.target.value }
                })}
                fullWidth
                autoFocus
              />
              <Select
                value={editDialog.player.frequency}
                onChange={(e) => setEditDialog({
                  ...editDialog,
                  player: { ...editDialog.player, frequency: e.target.value }
                })}
                fullWidth
              >
                {FREQUENCY_OPTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, player: null })}>
            Annuleren
          </Button>
          <Button
            onClick={handleEdit}
            variant="contained"
            disabled={!editDialog.player?.name.trim()}
          >
            Opslaan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
