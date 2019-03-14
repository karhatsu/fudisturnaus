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
    tournamentId: PropTypes.number.isRequired,
  }

  static defaultProps = {
    editable: false,
  }

  render() {
    const matchesByDate = this.groupByDate()
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
    const { renderMatch, selectedClubId, selectedTeamId, tournamentId } = this.props
    const matchProps = { match, selectedClubId, selectedTeamId, tournamentId }
    return (
      <div className={resolveColStyles(this.props.fieldsCount)} key={match.id}>
        {renderMatch(matchProps)}
      </div>
    )
  }
}
