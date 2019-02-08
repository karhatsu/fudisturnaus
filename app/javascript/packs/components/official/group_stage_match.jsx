import React from 'react'
import PropTypes from 'prop-types'
import { format, parseISO } from 'date-fns'

export default class GroupStageMatch extends React.PureComponent {
  static propTypes = {
    accessKey: PropTypes.string.isRequired,
    match: PropTypes.shape({
      id: PropTypes.number.isRequired,
      startTime: PropTypes.string.isRequired,
      field: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired,
      homeTeam: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired,
      awayTeam: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired,
      homeGoals: PropTypes.number,
      awayGoals: PropTypes.number,
    }).isRequired,
    onSave: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { formOpen: false, errors: [] }
  }

  render() {
    const { match: { startTime, field, homeTeam, awayTeam } } = this.props
    return (
      <div className="GroupStageMatch" onClick={this.openForm}>
        <div className="GroupStageMatch-row1">
          <div className="GroupStageMatch-matchInfo">
            <div className="GroupStageMatch-teams">{homeTeam.name} - {awayTeam.name}</div>
            <div className="GroupStageMatch-startTime">{format(parseISO(startTime), 'HH:mm')}, {field.name}</div>
          </div>
          <div className="GroupStageMatch-result">{this.renderResult()}</div>
        </div>
        {this.state.errors.length > 0 && <div className="Error GroupStageMatch-error">{this.state.errors.join('. ')}.</div>}
      </div>
    )
  }

  renderResult = () => {
    const { match: { homeGoals, awayGoals } } = this.props
    if (this.state.formOpen) {
      return this.renderForm()
    }
    if (homeGoals || homeGoals === 0) {
      return <span>{homeGoals} - {awayGoals}</span>
    }
    return <span className="GroupStageMatch-noResult">Tulos</span>
  }

  renderForm = () => {
    return (
      <div>
        <div className="GroupStageMatch-resultFields">
          {this.renderGoalsField('homeGoals')}
          <span className="GoalsSeparator">-</span>
          {this.renderGoalsField('awayGoals')}
        </div>
        <div className="GroupStageMatch-buttons">
          <input type="button" value="&#x2705;" onClick={this.saveResult} className="GroupStageMatch-button"/>
          <input type="button" value="&#x274C;" onClick={this.cancel} className="GroupStageMatch-button"/>
        </div>
      </div>
    )
  }

  renderGoalsField = (name) => {
    const goals = this.state[name]
    const value = goals || goals === 0 ? goals : ''
    return <input type="number" value={value} onChange={this.setGoals(name)} className="GoalsField"/>
  }

  openForm = () => {
    if (!this.state.formOpen) {
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
        'X-Access-Key': accessKey
      },
      body: JSON.stringify({
        group_stage_match: {
          home_goals: homeGoals,
          away_goals: awayGoals
        }
      })
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
