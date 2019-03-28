import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns'

export function buildTournamentFromSocketData(oldTournament, data) {
  const { groupId, groupStageMatch, playoffMatch, groupResults, resolvedPlayoffMatches } = data
  const tournament = { ...oldTournament }
  if (groupStageMatch) {
    const { id, homeGoals, awayGoals } = groupStageMatch
    tournament.groupStageMatches = updateMatchResult(tournament.groupStageMatches, id, homeGoals, awayGoals)
  } else if (playoffMatch) {
    const { id, homeGoals, awayGoals, penalties } = playoffMatch
    tournament.playoffMatches = updateMatchResult(tournament.playoffMatches, id, homeGoals, awayGoals, penalties)
  }
  if (groupResults) {
    tournament.groups = updateGroupResults(tournament.groups, groupId, groupResults)
  }
  if (resolvedPlayoffMatches) {
    tournament.playoffMatches = updatePlayoffMatches(tournament.playoffMatches, resolvedPlayoffMatches)
  }
  return tournament
}

function updateMatchResult(matches, matchId, homeGoals, awayGoals, penalties) {
  const matchesWithResult = [...matches]
  const matchIndex = matchesWithResult.findIndex(match => match.id === matchId)
  if (matchIndex !== -1) {
    const match = { ...matchesWithResult[matchIndex], homeGoals, awayGoals, penalties }
    matchesWithResult.splice(matchIndex, 1, match)
  }
  return matchesWithResult
}

function updateGroupResults(groups, groupId, groupResults) {
  const updatedGroups = [...groups]
  const groupIndex = updatedGroups.findIndex(group => group.id === groupId)
  if (groupIndex !== -1) {
    const group = { ...updatedGroups[groupIndex], results: groupResults }
    updatedGroups.splice(groupIndex, 1, group)
  }
  return updatedGroups
}

function updatePlayoffMatches(originalPlayoffMatches, newPlayoffMatches) {
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

export function formatMatchTime(tournamentDays, time) {
  const weekDay = tournamentDays > 1 ? `${formatWeekDay(parseISO(time))} ` : ''
  return `${weekDay}${formatTime(time)}`
}

function formatWeekDay(date) {
  // import { fi } from 'date-fns/locale' && format(date, 'EEEEEE', { locale: fi })
  const enWeekDay = format(date, 'EEEEEE')
  switch (enWeekDay) {
    case 'Mo':
      return 'ma'
    case 'Tu':
      return 'ti'
    case 'We':
      return 'ke'
    case 'Th':
      return 'to'
    case 'Fr':
      return 'pe'
    case 'Sa':
      return 'la'
    case 'Su':
      return 'su'
  }
}

export function formatTime(time) {
  return format(parseISO(time), 'HH:mm')
}

export function resolveWeekDay(baseDate, increment) {
  return formatWeekDay(addDays(parseISO(baseDate), increment))
}

export function resolveDay(date, time) {
  return differenceInCalendarDays(parseISO(time), parseISO(date)) + 1
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
