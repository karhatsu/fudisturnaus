import React from 'react'
import { endOfDay, format, isBefore, isSameDay, parseISO } from 'date-fns'

import Loading from './loading'
import Title from './title'
import TournamentLinkBox from './tournament_link_box'
import { fetchTournaments } from './api-client'

export default class Main extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      tournaments: undefined,
    }
  }

  render() {
    const { error, tournaments } = this.state
    return (
      <div>
        <Title loading={!error && !tournaments} text="fudisturnaus.com"/>
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
          <div className="title-2">{title}</div>
          {tournaments.map(this.renderTournament)}
        </React.Fragment>
      )
    }
  }

  renderTournament = tournament => {
    const { id } = tournament
    return <TournamentLinkBox key={id} to={`/tournaments/${id}`} tournament={tournament}/>
  }

  componentDidMount() {
    fetchTournaments((err, tournaments) => {
      if (err) {
        this.setState({ error: true })
      } else {
        this.setState({ tournaments })
      }
    })
  }
}
