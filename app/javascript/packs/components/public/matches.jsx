import React from 'react'
import PropTypes from 'prop-types'
import isSameDay from 'date-fns/isSameDay'
import { resolveColStyles } from '../util/util'
import Message from '../components/message'

export default class Matches extends React.PureComponent {
  static propTypes = {
    clubs: PropTypes.array.isRequired,
    editable: PropTypes.bool.isRequired,
    fieldsCount: PropTypes.number.isRequired,
    matches: PropTypes.array.isRequired,
    renderMatch: PropTypes.func.isRequired,
    selectedClubId: PropTypes.number,
    selectedTeamId: PropTypes.number,
    showEmptyError: PropTypes.bool,
    tournamentDays: PropTypes.number.isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  static defaultProps = {
    editable: false,
  }

  render() {
    const matchesByStartTime = this.groupByStartTime()
    if(Object.keys(matchesByStartTime).length === 0 && this.props.showEmptyError) {
      return <Message type="error">Ei yhtään ottelua, muuta hakuehtoja</Message>
    }
    return (
      <div className="matches">
        {this.renderDates(matchesByStartTime)}
      </div>
    )
  }

  groupByStartTime = () => {
    return this.props.matches.reduce((matches, match) => {
      matches[match.startTime] = matches[match.startTime] || []
      matches[match.startTime].push(match)
      return matches
    }, {})
  }

  renderDates = matchesByStartTime => {
    const dateRows = []
    let previousStartTime = undefined
    Object.keys(matchesByStartTime).forEach(date => {
      const dateChanged = previousStartTime && !isSameDay(new Date(previousStartTime), new Date(date))
      dateRows.push(this.renderDate(matchesByStartTime, date, dateChanged))
      previousStartTime = date
    })
    return dateRows
  }

  renderDate = (matchesByStartTime, date, dateChanged) => {
    const classes = 'row match-time-row' + (dateChanged ? ' match-time-row--new-date' : '')
    return (
      <div className={classes} key={date}>
        {matchesByStartTime[date].map(this.renderMatch)}
      </div>
    )
  }

  renderMatch = match => {
    const { clubs, fieldsCount, renderMatch, selectedClubId, selectedTeamId, tournamentDays, tournamentId } = this.props
    const matchProps = { clubs, fieldsCount, match, selectedClubId, selectedTeamId, tournamentDays, tournamentId }
    return (
      <div className={resolveColStyles(this.props.fieldsCount)} key={match.id}>
        {renderMatch(matchProps)}
      </div>
    )
  }
}
