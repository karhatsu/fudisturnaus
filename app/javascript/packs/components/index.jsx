import React from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'

import Loading from './loading'
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
        <div className="title">fudisturnaus.com</div>
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    const { tournaments } = this.state
    if (!tournaments) {
      return <Loading/>
    }
    return (
      <div className="tournament-links">
        {!tournaments.length ? 'Ei turnauksia' : tournaments.map(this.renderTournament)}
      </div>
    )
  }

  renderTournament = tournament => {
    const { id, name, location, startDate, endDate } = tournament
    return (
      <Link to={`/tournaments/${id}`} key={id} className="tournament-link">
        <div className="tournament-link__tournament-name">{name}</div>
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
