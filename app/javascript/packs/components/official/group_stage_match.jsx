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
  }

  constructor(props) {
    super(props)
    const { match: { homeGoals, awayGoals } } = props
    this.state = { resultOpen: false, homeGoals, awayGoals, errors: [] }
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
    const { resultOpen, homeGoals, awayGoals } = this.state
    if (resultOpen) {
      return (
        <React.Fragment>
          <input type="number" value={homeGoals || ''} onChange={this.setHomeGoals}/>
          <span>-</span>
          <input type="number" value={awayGoals || ''} onChange={this.setAwayGoals}/>
          <input type="button" value="Tallenna" onClick={this.saveResult}/>
        </React.Fragment>
      )
    } else {
      return <a onClick={this.openResult}>{homeGoals} - {awayGoals}</a>
    }
  }

  openResult = () => {
    const { match: { homeGoals, awayGoals } } = this.props
    this.setState({ resultOpen: true, homeGoals, awayGoals })
  }

  setHomeGoals = event => {
    this.setState({ homeGoals: event.target.value })
  }

  setAwayGoals = event => {
    this.setState({ awayGoals: event.target.value })
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
