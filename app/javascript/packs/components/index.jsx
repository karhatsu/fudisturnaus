import React from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { formatTournamentDates } from './util/util'

export default class Main extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      tournaments: undefined
    }
  }

  render() {
    return (
      <div>
        <div className="Title">fudisturnaus.com</div>
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    const { tournaments } = this.state
    if (!tournaments) {
      return <div>Loading...</div>
    }
    return (
      <div className="TournamentLinks">
        {!tournaments.length ? 'Ei turnauksia' : tournaments.map(this.renderTournament)}
      </div>
    )
  }

  renderTournament = tournament => {
    const { id, name, location, startDate, endDate } = tournament
    return (
      <Link to={`/tournaments/${id}`} key={id} className="TournamentLink">
        <div className="TournamentLink-tournamentName">{name}</div>
        <div>{location}, {formatTournamentDates(startDate, endDate)}</div>
      </Link>
    )
  }

  formatDate = date => {
    return format(parseISO(date), 'dd.MM.yyyy')
  }

  componentDidMount() {
    fetch('/api/v1/tournaments')
      .then(response => response.json())
      .then(json => this.setState({ tournaments: json.tournaments }))
      .catch(console.error) // eslint-disable-line no-console
  }
}
