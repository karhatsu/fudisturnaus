import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns'

export function formatTournamentDates(startDate, endDate) {
  const dates = [formatDate(startDate)]
  if (startDate !== endDate) {
    dates.push(formatDate(endDate))
  }
  return dates.join(' - ')
}

export function formatDateRange(startDate, days = 1) {
  const dates = [formatDate(startDate)]
  if (days > 1) {
    dates.push(resolveDate(startDate, days - 1))
  }
  return dates.join(' - ')
}

export function resolveDate(baseDate, increment) {
  return format(addDays(parse(baseDate), increment), 'dd.MM.yyyy')
}

export function formatDate(date) {
  return format(parse(date), 'dd.MM.yyyy')
}

export function formatMatchTime(tournamentDays, time) {
  const formattedTime = formatTime(time)
  if (tournamentDays > 1) return `${formatWeekDay(parse(time))} ${formattedTime}`
  else if (tournamentDays === 1) return formattedTime
  else return `${formatDate(time)} ${formattedTime}`
}

export function formatTime(time) {
  return format(parse(time), 'HH:mm')
}

export function formatDateTime(date) {
  return format(parse(date), 'dd.MM.yyyy HH:mm')
}

export function resolveWeekDay(baseDate, increment) {
  return formatWeekDay(addDays(parse(baseDate), increment))
}

export function resolveDay(date, time) {
  return differenceInCalendarDays(parse(time), parse(date)) + 1
}

function parse(date) {
  if (typeof date === 'string') {
    return parseISO(date)
  }
  return date
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
