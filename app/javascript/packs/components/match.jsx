import React from 'react'
import PropTypes from 'prop-types'
import { format, parseISO } from 'date-fns'
import { matchTypes } from './util/enums'
import { saveResult } from './api-client'

export default class Match extends React.PureComponent {
  static propTypes = {
    accessKey: PropTypes.string,
    editable: PropTypes.bool.isRequired,
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
  }

  constructor(props) {
    super(props)
    this.state = { formOpen: false, errors: [] }
  }

  render() {
    const { editable, match: { startTime, field, homeTeam, awayTeam, title, ageGroup, group } } = this.props
    const rootClasses = ['match']
    if (editable) {
      rootClasses.push('match--editable')
    }
    return (
      <div className={rootClasses.join(' ')} onClick={this.openForm}>
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
        {this.state.errors.length > 0 && <div className="error match__error">{this.state.errors.join('. ')}.</div>}
      </div>
    )
  }

  renderMatchInfo = (startTime, field, ageGroup, group) => {
    return (
      <div>
        <span className="match__start-time">{format(parseISO(startTime), 'HH:mm')}</span>
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

  renderResult = () => {
    const { editable, match: { homeTeam, awayTeam, homeGoals, awayGoals, penalties } } = this.props
    if (this.state.formOpen) {
      return this.renderForm()
    }
    if (homeGoals || homeGoals === 0) {
      return <span>{homeGoals} - {awayGoals}{penalties ? ' rp' : ''}</span>
    } else if (editable && homeTeam && awayTeam) {
      return <span className="match__no-result">Tulos</span>
    }
  }

  renderForm = () => {
    return (
      <div>
        <div className="match__result-fields">
          {this.renderGoalsField('homeGoals')}
          <span className="match__goals-separator">-</span>
          {this.renderGoalsField('awayGoals')}
        </div>
        {this.renderPenaltiesField()}
        <div className="match__buttons">
          <input type="button" value="&#x2705;" onClick={this.saveResult} className="match__button"/>
          <input type="button" value="&#x274C;" onClick={this.cancel} className="match__button"/>
        </div>
      </div>
    )
  }

  renderGoalsField = (name) => {
    const goals = this.state[name]
    const value = goals || goals === 0 ? goals : ''
    return <input type="number" value={value} onChange={this.setGoals(name)} className="match__goals-field"/>
  }

  renderPenaltiesField = () => {
    if (this.props.match.type === matchTypes.playoff) {
      return (
        <div className="match__penalties">
          <input type="checkbox" value={true} checked={this.state.penalties} onChange={this.setPenalties}/> rp
        </div>
      )
    }
  }

  openForm = () => {
    const { editable, match: { homeTeam, awayTeam, homeGoals, awayGoals, penalties } } = this.props
    if (editable && !this.state.formOpen && homeTeam && awayTeam) {
      this.setState({ formOpen: true, homeGoals, awayGoals, penalties })
    }
  }

  cancel = () => {
    this.setState({ formOpen: false, errors: [] })
  }

  setGoals = name => {
    return event => {
      this.setState({ [name]: parseInt(event.target.value) })
    }
  }

  setPenalties = event => {
    this.setState({ penalties: event.target.checked })
  }

  saveResult = () => {
    const { accessKey, match: { id, type } } = this.props
    const { homeGoals, awayGoals, penalties } = this.state
    saveResult(accessKey, type, id, homeGoals, awayGoals, penalties, (errors) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
      }
    })
  }
}
