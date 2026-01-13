// Calculate player statistics from all results
export function calculateStandings(players, allResults) {
  const stats = {}

  // Initialize stats for all players
  players.forEach(player => {
    stats[player.id] = {
      id: player.id,
      name: player.name,
      gamesPlayed: 0,
      totalPoints: 0,
      average: 0
    }
  })

  // Process all results
  allResults.forEach(result => {
    if (!result || !result.matches) return

    result.matches.forEach(match => {
      // Team 1
      if (match.team1 && match.team1.players) {
        match.team1.players.forEach(playerId => {
          if (stats[playerId]) {
            stats[playerId].gamesPlayed++
            stats[playerId].totalPoints += match.team1.points || 0
          }
        })
      }

      // Team 2
      if (match.team2 && match.team2.players) {
        match.team2.players.forEach(playerId => {
          if (stats[playerId]) {
            stats[playerId].gamesPlayed++
            stats[playerId].totalPoints += match.team2.points || 0
          }
        })
      }
    })
  })

  // Calculate averages
  Object.keys(stats).forEach(playerId => {
    const stat = stats[playerId]
    stat.average = stat.gamesPlayed > 0
      ? stat.totalPoints / stat.gamesPlayed
      : 0
  })

  // Convert to array and sort
  const standings = Object.values(stats)

  standings.sort((a, b) => {
    // First by average (descending)
    if (b.average !== a.average) {
      return b.average - a.average
    }
    // Then by games played (descending)
    return b.gamesPlayed - a.gamesPlayed
  })

  return standings
}

// Get player rankings (sorted by current standings)
export function getPlayerRankings(players, allResults) {
  const standings = calculateStandings(players, allResults)

  return standings.map((stat, index) => ({
    ...stat,
    rank: index + 1
  }))
}

// Check if player should be bold (played >= 50% of max games)
export function shouldBeBold(player, allStandings) {
  if (allStandings.length === 0) return false

  const maxGames = Math.max(...allStandings.map(s => s.gamesPlayed))
  const threshold = maxGames / 2

  return player.gamesPlayed >= threshold
}

// Get ordered participants list based on rankings
export function orderParticipantsByRank(participantIds, players, allResults) {
  const rankings = getPlayerRankings(players, allResults)

  const ordered = participantIds
    .map(id => rankings.find(r => r.id === id))
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank)

  return ordered
}
