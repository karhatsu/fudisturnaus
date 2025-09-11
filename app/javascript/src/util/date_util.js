import { addDays, differenceInCalendarDays, format } from 'date-fns'
import { TZDate } from '@date-fns/tz'

const timeZone = 'Europe/Helsinki'

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
  return format(addDays(toTzDate(baseDate), increment), 'dd.MM.yyyy')
}

export function formatDate(date) {
  return format(toTzDate(date), 'dd.MM.yyyy')
}

export function formatMatchTime(tournamentDays, time) {
  const formattedTime = formatTime(time)
  if (tournamentDays > 1) return `${formatWeekDay(toTzDate(time))} ${formattedTime}`
  else if (tournamentDays === 1) return formattedTime
  else return `${formatDate(time)} ${formattedTime}`
}

export function formatTime(time) {
  return format(toTzDate(time), 'HH:mm')
}

export function formatDateTime(date) {
  return format(toTzDate(date), 'dd.MM.yyyy HH:mm')
}

export function resolveWeekDay(baseDate, increment) {
  return formatWeekDay(addDays(toTzDate(baseDate), increment))
}

export function resolveDay(date, time) {
  return differenceInCalendarDays(toTzDate(time), toTzDate(date)) + 1
}

function toTzDate(date) {
  // works both for date strings and dates
  return new TZDate(date, timeZone)
}

export function parseDateAndTime(date, time) {
  const [y, m, d] = date.split('-').map(Number)
  const [h, min] = time.split(':').map(Number)
  return new Date(TZDate.tz(timeZone, y, m - 1, d, h, min, 0))
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
