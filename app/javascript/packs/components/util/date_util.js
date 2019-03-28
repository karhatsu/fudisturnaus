import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns'

export function formatTournamentDates(startDate, endDate) {
  const dates = [formatDate(startDate)]
  if (startDate !== endDate) {
    dates.push(formatDate(endDate))
  }
  return dates.join(' - ')
}

export function formatDate(date) {
  return format(parse(date), 'dd.MM.yyyy')
}

export function formatMatchTime(tournamentDays, time) {
  const weekDay = tournamentDays > 1 ? `${formatWeekDay(parse(time))} ` : ''
  return `${weekDay}${formatTime(time)}`
}

export function formatTime(time) {
  return format(parse(time), 'HH:mm')
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
