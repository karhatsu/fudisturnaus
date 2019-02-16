import { format, parseISO } from 'date-fns'

export function addResult(matches, matchId, homeGoals, awayGoals, penalties) {
  const matchesWithResult = [...matches]
  const matchIndex = matchesWithResult.findIndex(match => match.id === matchId)
  if (matchIndex !== -1) {
    const match = { ...matchesWithResult[matchIndex], homeGoals, awayGoals, penalties }
    matchesWithResult.splice(matchIndex, 1, match)
  }
  return matchesWithResult
}

export function updateGroupResults(groups, groupId, groupResults) {
  const updatedGroups = [...groups]
  const groupIndex = updatedGroups.findIndex(group => group.id === groupId)
  if (groupIndex !== -1) {
    const group = { ...updatedGroups[groupIndex], results: groupResults }
    updatedGroups.splice(groupIndex, 1, group)
  }
  return updatedGroups
}

export function updatePlayoffMatches(originalPlayoffMatches, newPlayoffMatches) {
  const playoffMatches = [...originalPlayoffMatches]
  newPlayoffMatches.forEach(playoffMatch => {
    const matchIndex = playoffMatches.findIndex(match => match.id === playoffMatch.id)
    if (matchIndex !== -1) {
      const newMatch = { ...playoffMatches[matchIndex], ...playoffMatch }
      playoffMatches.splice(matchIndex, 1, newMatch)
    }
  })
  return playoffMatches
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

export function resolveColStyles(count) {
  if (count === 1) {
    return 'col-xs-12'
  } else if (count === 2) {
    return 'col-xs-12 col-sm-6'
  } else if (count === 3) {
    return 'col-xs-12 col-sm-6 col-md-4'
  } else if (count % 2 === 0) {
    return 'col-xs-12 col-sm-6 col-lg-3'
  } else {
    return 'col-xs-12 col-sm-6 col-md-4'
  }
}
