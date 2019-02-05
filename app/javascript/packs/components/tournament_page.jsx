import React from 'react'
import PropTypes from 'prop-types'

export default class TournamentPage extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      tournament: undefined
    }
  }

  render() {
    const { tournament } = this.state
    if (!tournament) {
      return <div>Loading...</div>
    }
    const { name, location, startDate, groupStageMatches } = tournament
    return (
      <div>
        <h2>{name} - {location}, {startDate}</h2>
        <h2>Alkusarjan ottelut</h2>
        <table>
          <thead>
            <tr>
              <th>Aika</th>
              <th>Kenttä</th>
              <th>Koti</th>
              <th>Vieras</th>
              <th>Tulos</th>
            </tr>
          </thead>
          <tbody>
            {groupStageMatches.map(this.renderGroupStageMatch)}
          </tbody>
        </table>
      </div>
    )
  }

  renderGroupStageMatch = groupStageMatch => {
    const { id, startTime, field, homeTeam, awayTeam, homeGoals, awayGoals } = groupStageMatch
    return (
      <tr key={id}>
        <td>{startTime}</td>
        <td>{field.name}</td>
        <td>{homeTeam.name}</td>
        <td>{awayTeam.name}</td>
        <td>{homeGoals} - {awayGoals}</td>
      </tr>
    )
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props
    fetch(`/api/v1/tournaments/${id}`)
      .then(response => response.json())
      .then(tournament => this.setState({ tournament }))
      .catch(console.error) // eslint-disable-line no-console
  }
}
