import React from 'react'
import PropTypes from 'prop-types'
import { formatTime } from '../util/util'

export default class Match extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      field: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      title: PropTypes.string,
      homeTeam: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      awayTeam: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      homeGoals: PropTypes.number,
      awayGoals: PropTypes.number,
      penalties: PropTypes.bool,
      ageGroup: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      group: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }).isRequired,
    selectedClubId: PropTypes.number,
    selectedTeamId: PropTypes.number,
    tournamentId: PropTypes.number.isRequired,
  }

  render() {
    const { match: { startTime, field, homeTeam, awayTeam, title, ageGroup, group } } = this.props
    return (
      <div className={this.resolveMainClasses()} onClick={this.onClick}>
        <div className="match__row1">
          <div className="match__matchInfo">
            {this.renderMatchInfo(startTime, field, ageGroup, group)}
            <div className="match__teams">
              {this.renderPlayoffMatchTitle(homeTeam, awayTeam, title)}
              {this.renderTeams(homeTeam, awayTeam)}
            </div>
          </div>
          <div className="match__result">{this.renderResult()}</div>
        </div>
        {this.renderErrors()}
      </div>
    )
  }

  resolveMainClasses() {
    return 'match'
  }

  renderMatchInfo = (startTime, field, ageGroup, group) => {
    return (
      <div>
        <span className="match__start-time">{formatTime(startTime)}</span>
        {field.name}, {ageGroup.name}{group ? `, ${group.name}` : ''}
      </div>
    )
  }

  renderPlayoffMatchTitle = (homeTeam, awayTeam, title) => {
    if (title) {
      const text = homeTeam || awayTeam ? `${title}:` : title
      return <span className="match__playoff-title">{text}</span>
    }
  }

  renderTeams = (homeTeam, awayTeam) => {
    if (homeTeam || awayTeam) {
      return (
        <React.Fragment>
          {this.renderTeam(homeTeam)}
          <span className="match__teams-separator">-</span>
          {this.renderTeam(awayTeam)}
        </React.Fragment>
      )
    }
  }

  renderTeam = team => {
    if (!team) return <span className="match__team-name">?</span>
    const { selectedClubId, selectedTeamId } = this.props
    const classes = ['match__team-name']
    if (team.id === selectedTeamId || team.clubId === selectedClubId) {
      classes.push('match__team-name--selected')
    }
    return <span className={classes.join(' ')}>{team.name}</span>
  }

  renderResult() {
    const { match: { homeGoals, awayGoals, penalties } } = this.props
    if (homeGoals || homeGoals === 0) {
      return <span>{homeGoals} - {awayGoals}{penalties ? ' rp' : ''}</span>
    }
  }

  renderErrors() {
    return null
  }
}
