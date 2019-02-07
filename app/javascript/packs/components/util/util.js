export function addResult(matches, matchId, homeGoals, awayGoals) {
  const matchesWithResult = [...matches]
  const matchIndex = matchesWithResult.findIndex(match => match.id === matchId)
  if (matchIndex !== -1) {
    const match = { ...matchesWithResult[matchIndex], homeGoals, awayGoals }
    matchesWithResult.splice(matchIndex, 1, match)
  }
  return matchesWithResult
}
