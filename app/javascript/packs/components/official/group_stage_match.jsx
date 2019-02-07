import React from 'react'
import PropTypes from 'prop-types'

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
    this.state = { resultOpen: false, errors: [] }
  }

  render() {
    const { match: { startTime, field, homeTeam, awayTeam } } = this.props
    return (
      <tr>
        <td>{startTime}</td>
        <td>{field.name}</td>
        <td>{homeTeam.name}</td>
        <td>{awayTeam.name}</td>
        <td>{this.renderResult()}</td>
        <td>{this.state.errors.join('. ')}</td>
      </tr>
    )
  }

  renderResult = () => {
    const { match: { homeGoals, awayGoals } } = this.props
    if (this.state.resultOpen) {
      return this.renderForm()
    }
    const text = homeGoals || homeGoals === 0 ? `${homeGoals} - ${awayGoals}` : 'Tulos'
    return <a onClick={this.openResult} href="#">{text}</a>
  }

  renderForm = () => {
    return (
      <React.Fragment>
        {this.renderGoalsField('homeGoals')}
        <span>-</span>
        {this.renderGoalsField('awayGoals')}
        <input type="button" value="Tallenna" onClick={this.saveResult}/>
        <input type="button" value="X" onClick={this.cancel}/>
      </React.Fragment>
    )
  }

  renderGoalsField = (name) => {
    const goals = this.state[name]
    const value = goals || goals === 0 ? goals : ''
    return <input type="number" value={value} onChange={this.setGoals(name)}/>
  }

  openResult = (event) => {
    event.preventDefault()
    const { match: { homeGoals, awayGoals } } = this.props
    this.setState({ resultOpen: true, homeGoals, awayGoals })
  }

  cancel = () => {
    this.setState({ resultOpen: false, errors: [] })
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
          this.setState({ resultOpen: false, errors: [] })
        } else {
          response.json().then(({ errors }) => {
            this.setState({ errors })
          })
        }
      })
      .catch(() => this.setState({ errors: ['Yhteysvirhe, yritä uudestaan'] }))
  }
}
