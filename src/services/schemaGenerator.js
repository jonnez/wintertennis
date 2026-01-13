// Court schema configurations
// The schemas define which ranked players play together
// #1 = highest ranked player in participants list

export const SCHEMAS = {
  wit: {
    name: 'Wit',
    number: 1,
    color: '#f5f5f5',
    textColor: '#000000',
    matches: [
      { court: 1, team1: [1, 4], team2: [2, 3] },
      { court: 2, team1: [5, 12], team2: [7, 10] },
      { court: 3, team1: [6, 11], team2: [8, 9] }
    ]
  },
  geel: {
    name: 'Geel',
    number: 2,
    color: '#fff59d',
    textColor: '#000000',
    matches: [
      { court: 1, team1: [1, 12], team2: [2, 10] },
      { court: 2, team1: [3, 11], team2: [4, 8] },
      { court: 3, team1: [5, 9], team2: [6, 7] }
    ]
  },
  rood: {
    name: 'Rood',
    number: 3,
    color: '#ef5350',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [1, 8], team2: [3, 6] },
      { court: 2, team1: [2, 7], team2: [4, 5] },
      { court: 3, team1: [9, 12], team2: [10, 11] }
    ]
  },
  groen: {
    name: 'Groen',
    number: 4,
    color: '#66bb6a',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [1, 10], team2: [4, 7] },
      { court: 2, team1: [2, 11], team2: [5, 8] },
      { court: 3, team1: [3, 12], team2: [6, 9] }
    ]
  },
  zwart: {
    name: 'Zwart',
    number: 5,
    color: '#424242',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [1, 9], team2: [3, 7] },
      { court: 2, team1: [2, 12], team2: [6, 8] },
      { court: 3, team1: [4, 11], team2: [5, 10] }
    ]
  }
}

// Get all schema names
export function getSchemaNames() {
  return Object.keys(SCHEMAS)
}

// Get random schema
export function getRandomSchema() {
  const names = getSchemaNames()
  const randomIndex = Math.floor(Math.random() * names.length)
  return names[randomIndex]
}

// Generate matches with actual player data
export function generateMatches(schemaName, rankedParticipants) {
  const schema = SCHEMAS[schemaName]
  if (!schema) return []

  const matches = schema.matches.map(match => {
    // Get players by rank (1-indexed in schema, 0-indexed in array)
    const getPlayer = (rank) => {
      const index = rank - 1
      return rankedParticipants[index] || null
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

  return matches
}

// Format match for display
export function formatMatchDisplay(match, participants) {
  const getPlayerName = (playerId) => {
    const player = participants.find(p => p.id === playerId)
    return player ? player.name : '???'
  }

  const team1Names = match.team1.players.map(getPlayerName).join(' - ')
  const team2Names = match.team2.players.map(getPlayerName).join(' - ')

  return `${team1Names} tegen ${team2Names}`
}

// Validate that we have exactly 12 participants
export function canGenerateSchema(participants) {
  return participants && participants.length === 12
}
