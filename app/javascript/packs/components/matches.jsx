import React from 'react'
import PropTypes from 'prop-types'
import Match from './match'
import {resolveColStyles} from './util/util'

export default class Matches extends React.PureComponent {
  static propTypes = {
    accessKey: PropTypes.string,
    editable: PropTypes.bool,
    fieldsCount: PropTypes.number.isRequired,
    matches: PropTypes.array.isRequired,
    selectedClubId: PropTypes.number,
    selectedTeamId: PropTypes.number,
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
    return (
      <div className={resolveColStyles(this.props.fieldsCount)} key={match.id}>
        <Match
          accessKey={this.props.accessKey}
          editable={this.props.editable}
          match={match}
          selectedClubId={this.props.selectedClubId}
          selectedTeamId={this.props.selectedTeamId}
        />
      </div>
    )
  }
}
