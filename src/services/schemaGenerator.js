// Court schema configurations
// The schemas define which ranked players play together
// #1 = highest ranked player in participants list

// Schemas for 12 players (3 courts with doubles)
export const SCHEMAS_12 = {
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

// Schemas for 10 players (2 courts with doubles, 1 court with singles)
export const SCHEMAS_10 = {
  wit: {
    name: 'Wit',
    number: 1,
    color: '#f5f5f5',
    textColor: '#000000',
    matches: [
      { court: 1, team1: [1, 4], team2: [2, 3] },
      { court: 2, team1: [5, 10], team2: [7, 8] },
      { court: 3, team1: [6], team2: [9] }
    ]
  },
  geel: {
    name: 'Geel',
    number: 2,
    color: '#fff59d',
    textColor: '#000000',
    matches: [
      { court: 1, team1: [1, 10], team2: [2, 8] },
      { court: 2, team1: [3, 9], team2: [4, 6] },
      { court: 3, team1: [5], team2: [7] }
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
      { court: 3, team1: [9], team2: [10] }
    ]
  },
  groen: {
    name: 'Groen',
    number: 4,
    color: '#66bb6a',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [1, 9], team2: [4, 7] },
      { court: 2, team1: [2, 10], team2: [5, 6] },
      { court: 3, team1: [3], team2: [8] }
    ]
  },
  zwart: {
    name: 'Zwart',
    number: 5,
    color: '#424242',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [1, 7], team2: [3, 5] },
      { court: 2, team1: [2, 10], team2: [6, 8] },
      { court: 3, team1: [4], team2: [9] }
    ]
  }
}

// Schemas for 8 players (2 courts with doubles)
export const SCHEMAS_8 = {
  wit: {
    name: 'Wit',
    number: 1,
    color: '#f5f5f5',
    textColor: '#000000',
    matches: [
      { court: 1, team1: [1, 4], team2: [2, 3] },
      { court: 2, team1: [5, 8], team2: [6, 7] }
    ]
  },
  geel: {
    name: 'Geel',
    number: 2,
    color: '#fff59d',
    textColor: '#000000',
    matches: [
      { court: 1, team1: [1, 8], team2: [2, 6] },
      { court: 2, team1: [3, 7], team2: [4, 5] }
    ]
  },
  rood: {
    name: 'Rood',
    number: 3,
    color: '#ef5350',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [1, 6], team2: [3, 4] },
      { court: 2, team1: [2, 5], team2: [7, 8] }
    ]
  },
  groen: {
    name: 'Groen',
    number: 4,
    color: '#66bb6a',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [1, 7], team2: [4, 5] },
      { court: 2, team1: [2, 8], team2: [3, 6] }
    ]
  },
  zwart: {
    name: 'Zwart',
    number: 5,
    color: '#424242',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [1, 5], team2: [3, 7] },
      { court: 2, team1: [2, 6], team2: [4, 8] }
    ]
  }
}

// Schemas for 6 players (1 court with doubles, 1 court with singles)
export const SCHEMAS_6 = {
  wit: {
    name: 'Wit',
    number: 1,
    color: '#f5f5f5',
    textColor: '#000000',
    matches: [
      { court: 1, team1: [1, 4], team2: [2, 3] },
      { court: 2, team1: [5], team2: [6] }
    ]
  },
  geel: {
    name: 'Geel',
    number: 2,
    color: '#fff59d',
    textColor: '#000000',
    matches: [
      { court: 1, team1: [1, 6], team2: [2, 4] },
      { court: 2, team1: [3], team2: [5] }
    ]
  },
  rood: {
    name: 'Rood',
    number: 3,
    color: '#ef5350',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [1, 5], team2: [3, 4] },
      { court: 2, team1: [2], team2: [6] }
    ]
  },
  groen: {
    name: 'Groen',
    number: 4,
    color: '#66bb6a',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [1, 3], team2: [4, 5] },
      { court: 2, team1: [2], team2: [6] }
    ]
  },
  zwart: {
    name: 'Zwart',
    number: 5,
    color: '#424242',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [2, 5], team2: [3, 6] },
      { court: 2, team1: [1], team2: [4] }
    ]
  }
}

// Schemas for 4 players (1 court with doubles)
export const SCHEMAS_4 = {
  wit: {
    name: 'Wit',
    number: 1,
    color: '#f5f5f5',
    textColor: '#000000',
    matches: [
      { court: 1, team1: [1, 4], team2: [2, 3] }
    ]
  },
  geel: {
    name: 'Geel',
    number: 2,
    color: '#fff59d',
    textColor: '#000000',
    matches: [
      { court: 1, team1: [1, 3], team2: [2, 4] }
    ]
  },
  rood: {
    name: 'Rood',
    number: 3,
    color: '#ef5350',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [1, 2], team2: [3, 4] }
    ]
  },
  groen: {
    name: 'Groen',
    number: 4,
    color: '#66bb6a',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [2, 4], team2: [1, 3] }
    ]
  },
  zwart: {
    name: 'Zwart',
    number: 5,
    color: '#424242',
    textColor: '#ffffff',
    matches: [
      { court: 1, team1: [2, 3], team2: [1, 4] }
    ]
  }
}

// Get schemas based on number of participants
export function getSchemas(numParticipants) {
  switch (numParticipants) {
    case 12:
      return SCHEMAS_12
    case 10:
      return SCHEMAS_10
    case 8:
      return SCHEMAS_8
    case 6:
      return SCHEMAS_6
    case 4:
      return SCHEMAS_4
    default:
      return {}
  }
}

// For backward compatibility - default to 12 player schemas
export const SCHEMAS = SCHEMAS_12

// Get all schema names for given number of participants
export function getSchemaNames(numParticipants = 12) {
  return Object.keys(getSchemas(numParticipants))
}

// Get random schema for given number of participants
export function getRandomSchema(numParticipants = 12) {
  const names = getSchemaNames(numParticipants)
  const randomIndex = Math.floor(Math.random() * names.length)
  return names[randomIndex]
}

// Generate matches with actual player data
export function generateMatches(schemaName, rankedParticipants) {
  const schemas = getSchemas(rankedParticipants.length)
  const schema = schemas[schemaName]
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

// Validate that we have valid number of participants (even numbers from 4 to 12)
export function canGenerateSchema(participants) {
  if (!participants) return false
  const count = participants.length
  return count >= 4 && count <= 12 && count % 2 === 0
}
