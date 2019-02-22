import React from 'react'
import { Link } from 'react-router-dom'
import { endOfDay, format, isBefore, isSameDay, parseISO } from 'date-fns'

import Loading from './loading'
import { formatTournamentDates } from './util/util'

export default class Main extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      tournaments: undefined,
    }
  }

  render() {
    return (
      <div>
        <div className="title">
          <span className="title__emoji">⚽</span>
          fudisturnaus.com
        </div>
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    const { error, tournaments } = this.state
    if (error) {
      return <div className="message message--error">Virhe haettaessa turnauksia. Tarkasta verkkoyhteytesi ja lataa sivu uudestaan.</div>
    } else if (!tournaments) {
      return <Loading/>
    } else if (!tournaments.length) {
      return <div className="message message--error">Ei turnauksia</div>
    }
    const upcomingTournaments = this.findUpcomingTournaments(tournaments)
    const currentTournaments = this.findCurrentTournaments(tournaments)
    const pastTournaments = this.findPastTournaments(tournaments)
    return (
      <div className="tournament-links">
        {this.renderTournaments(currentTournaments, 'Turnaukset tänään')}
        {this.renderTournaments(upcomingTournaments, 'Tulevat turnaukset')}
        {this.renderTournaments(pastTournaments, 'Päättyneet turnaukset')}
      </div>
    )
  }

  findUpcomingTournaments = tournaments => {
    return tournaments.filter(t => isBefore(new Date(), parseISO(t.startDate))).sort((a, b) => parseISO(a.startDate) - parseISO(b.startDate))
  }

  findCurrentTournaments = tournaments => {
    return tournaments.filter(t => isSameDay(parseISO(t.startDate), new Date()) || isSameDay(parseISO(t.endDate), new Date()))
  }

  findPastTournaments = tournaments => {
    return tournaments.filter(t => isBefore(endOfDay(parseISO(t.endDate)), new Date()))
  }

  renderTournaments = (tournaments, title) => {
    if (tournaments.length) {
      return (
        <React.Fragment>
          <div className="index__subtitle">{title}</div>
          {tournaments.map(this.renderTournament)}
        </React.Fragment>
      )
    }
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
      .catch(err => {
        console.error(err) // eslint-disable-line no-console
        this.setState({ error: true })
      })
  }
}
