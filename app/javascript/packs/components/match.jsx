import React from 'react'
import PropTypes from 'prop-types'
import { format, parseISO } from 'date-fns'

export default class Match extends React.PureComponent {
  static propTypes = {
    accessKey: PropTypes.string,
    editable: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      id: PropTypes.number.isRequired,
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
      ageGroup: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      group: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }).isRequired,
    onSave: PropTypes.func,
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
            {this.renderTeams(homeTeam, awayTeam, title)}
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

  renderTeams = (homeTeam, awayTeam, title) => {
    if (homeTeam && awayTeam) {
      return (
        <div className="match__teams">
          {this.renderTeam(homeTeam)}
          <span className="match__teams-separator">-</span>
          {this.renderTeam(awayTeam)}
        </div>
      )
    }
    return <div className="match__teams">{title}</div>
  }

  renderTeam = team => {
    const { selectedClubId, selectedTeamId } = this.props
    const classes = ['match__team-name']
    if (team.id === selectedTeamId || team.clubId === selectedClubId) {
      classes.push('match__team-name--selected')
    }
    return <span className={classes.join(' ')}>{team.name}</span>
  }

  renderResult = () => {
    const { editable, match: { homeGoals, awayGoals } } = this.props
    if (this.state.formOpen) {
      return this.renderForm()
    }
    if (homeGoals || homeGoals === 0) {
      return <span>{homeGoals} - {awayGoals}</span>
    } else if (editable) {
      return <span className="match__no-result">Tulos</span>
    }
  }

  renderForm = () => {
    return (
      <div>
        <div className="match__result-fields">
          {this.renderGoalsField('homeGoals')}
          <span className="goals-separator">-</span>
          {this.renderGoalsField('awayGoals')}
        </div>
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
    return <input type="number" value={value} onChange={this.setGoals(name)} className="goals-field"/>
  }

  openForm = () => {
    if (this.props.editable && !this.state.formOpen) {
      const {match: {homeGoals, awayGoals}} = this.props
      this.setState({formOpen: true, homeGoals, awayGoals})
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

  saveResult = () => {
    const { accessKey, match: { id } } = this.props
    const { homeGoals, awayGoals } = this.state
    fetch(`/api/v1/official/group_stage_matches/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': accessKey,
      },
      body: JSON.stringify({
        group_stage_match: {
          home_goals: homeGoals,
          away_goals: awayGoals,
        },
      }),
    })
      .then(response => {
        if (response.ok) {
          this.props.onSave(id, homeGoals, awayGoals)
          this.setState({ formOpen: false, errors: [] })
        } else {
          response.json().then(({ errors }) => {
            this.setState({ errors })
          })
        }
      })
      .catch(() => this.setState({ errors: ['Yhteysvirhe, yritä uudestaan'] }))
  }
}