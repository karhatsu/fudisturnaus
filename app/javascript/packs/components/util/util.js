import { format, parseISO } from 'date-fns'

export function addResult(matches, matchId, homeGoals, awayGoals) {
  const matchesWithResult = [...matches]
  const matchIndex = matchesWithResult.findIndex(match => match.id === matchId)
  if (matchIndex !== -1) {
    const match = { ...matchesWithResult[matchIndex], homeGoals, awayGoals }
    matchesWithResult.splice(matchIndex, 1, match)
  }
  return matchesWithResult
}

export function formatTournamentDates(startDate, endDate) {
  const dates = [formatDate(startDate)]
  if (startDate !== endDate) {
    dates.push(formatDate(endDate))
  }
  return dates.join(' - ')
}

export function formatDate(date) {
  return format(parseISO(date), 'dd.MM.yyyy')
}
