import React from 'react'
import PropTypes from 'prop-types'
import { resolveColStyles } from '../util/util'

export default class Matches extends React.PureComponent {
  static propTypes = {
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
    const matchesByDate = this.groupByDate()
    if(Object.keys(matchesByDate).length === 0 && this.props.showEmptyError) {
      return <div className="message message--error">Ei yhtään ottelua, muuta hakuehtoja</div>
    }
    return (
      <div className="matches">
        {Object.keys(matchesByDate).map(date => this.renderDate(matchesByDate, date))}
      </div>
    )
  }

  groupByDate = () => {
    return this.props.matches.reduce((matches, match) => {
      matches[match.startTime] = matches[match.startTime] || []
      matches[match.startTime].push(match)
      return matches
    }, {})
  }

  renderDate = (matchesByDate, date) => {
    return (
      <div className="row match-time-row" key={date}>
        {matchesByDate[date].map(this.renderMatch)}
      </div>
    )
  }

  renderMatch = match => {
    const { renderMatch, selectedClubId, selectedTeamId, tournamentDays, tournamentId } = this.props
    const matchProps = { match, selectedClubId, selectedTeamId, tournamentDays, tournamentId }
    return (
      <div className={resolveColStyles(this.props.fieldsCount)} key={match.id}>
        {renderMatch(matchProps)}
      </div>
    )
  }
}
