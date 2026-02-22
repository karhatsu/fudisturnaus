import isSameDay from 'date-fns/isSameDay'
import { resolveColStyles } from '../util/util'
import Message from '../components/message'

const Matches = (props) => {
  const {
    ageGroups,
    clubs,
    fieldsCount,
    groups,
    renderMatch,
    selectedClubId,
    selectedTeamId,
    tournamentDays,
    tournamentId,
    matches,
    showEmptyError,
  } = props

  const groupByStartTime = () => {
    return matches.reduce((matches, match) => {
      matches[match.startTime] = matches[match.startTime] || []
      matches[match.startTime].push(match)
      return matches
    }, {})
  }

  const renderDates = (matchesByStartTime) => {
    const dateRows = []
    let previousStartTime = undefined
    Object.keys(matchesByStartTime).forEach((date) => {
      const dateChanged = previousStartTime && !isSameDay(new Date(previousStartTime), new Date(date))
      dateRows.push(renderDate(matchesByStartTime, date, dateChanged))
      previousStartTime = date
    })
    return dateRows
  }

  const renderDate = (matchesByStartTime, date, dateChanged) => {
    const classes = 'row match-time-row' + (dateChanged ? ' match-time-row--new-date' : '')
    return (
      <div className={classes} key={date}>
        {matchesByStartTime[date].map(renderMatchWrapper)}
      </div>
    )
  }

  const renderMatchWrapper = (match) => {
    const matchProps = {
      ageGroups,
      clubs,
      fieldsCount,
      groups,
      match,
      selectedClubId,
      selectedTeamId,
      tournamentDays,
      tournamentId,
    }
    return (
      <div className={resolveColStyles(fieldsCount)} key={match.id}>
        {renderMatch(matchProps)}
      </div>
    )
  }

  const matchesByStartTime = groupByStartTime()
  if (Object.keys(matchesByStartTime).length === 0 && showEmptyError) {
    return <Message type="error">Ei yhtään ottelua, muuta hakuehtoja</Message>
  }
  return <div className="matches">{renderDates(matchesByStartTime)}</div>
}

export default Matches
