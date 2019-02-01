import React from 'react'
import { Link } from 'react-router-dom'

export default class Main extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      tournaments: undefined
    }
  }

  render() {
    const { tournaments } = this.state
    if (!tournaments) {
      return <div>Loading...</div>
    }
    return (
      <div>
        {!tournaments.length ? 'Ei turnauksia' : tournaments.map(this.renderTournament)}
      </div>
    )
  }

  renderTournament = tournament => {
    const { id, name, location, startDate, endDate } = tournament
    return (
      <div key={id}>
        <Link to={`/tournaments/${id}`}>
          {name}, {location}, {startDate}{startDate !== endDate ? ` - ${endDate}` : ''}
        </Link>
      </div>
    )
  }

  componentDidMount() {
    fetch('/api/v1/tournaments')
      .then(response => response.json())
      .then(json => this.setState({ tournaments: json.tournaments }))
      .catch(console.error);
  }
}
