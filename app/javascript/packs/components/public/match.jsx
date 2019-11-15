import React from 'react'
import PropTypes from 'prop-types'
import { formatMatchTime } from '../util/date_util'
import Team from './team'

export default class Match extends React.PureComponent {
  static propTypes = {
    clubs: PropTypes.arrayOf(PropTypes.shape({
      logoUrl: PropTypes.string,
    })).isRequired,
    fieldsCount: PropTypes.number.isRequired,
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
    tournamentDays: PropTypes.number.isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  render() {
    const { match: { startTime, field, homeTeam, awayTeam, title, ageGroup, group }, tournamentDays } = this.props
    return (
      <div className={this.resolveMainClasses()} onClick={this.onClick}>
        <div className="match__row1">
          <div className="match__matchInfo">
            {this.renderMatchInfo(tournamentDays, startTime, field, ageGroup, group)}
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

  renderMatchInfo = (tournamentDays, startTime, field, ageGroup, group) => {
    const fieldName = this.props.fieldsCount > 1 ? `${field.name}, ` : ''
    return (
      <div>
        <span className="match__start-time">{formatMatchTime(tournamentDays, startTime)}</span>
        <span className="match__details">{fieldName}{ageGroup.name}{group ? `, ${group.name}` : ''}</span>
      </div>
    )
  }

  renderPlayoffMatchTitle = (homeTeam, awayTeam, title) => {
    if (title) {
      const text = homeTeam || awayTeam ? `${title}:` : title
      return <div className="match__playoff-title">{text}</div>
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
    if (!team) return <span>?</span>
    const { clubs, selectedClubId, selectedTeamId } = this.props
    const selected = team.id === selectedTeamId || team.clubId === selectedClubId
    return <Team clubId={team.clubId} clubs={clubs} name={team.name} selected={selected} />
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
