import React from 'react'
import PropTypes from 'prop-types'
import { endOfDay, isBefore, isSameDay, parseISO } from 'date-fns'

import { fetchTournaments } from './api_client'
import Loading from '../components/loading'
import Title from '../components/title'
import TournamentLinkBox from '../components/tournament_link_box'
import InfoBox from './info_box'

export default class TournamentList extends React.PureComponent {
  static propTypes = {
    buildLink: PropTypes.func.isRequired,
    children: PropTypes.arrayOf(PropTypes.element),
    showInfo: PropTypes.bool,
    title: PropTypes.string.isRequired,
  }

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
        <Title loading={!error && !tournaments} text={this.props.title}/>
        {this.props.showInfo && <InfoBox/>}
        {this.renderContent()}
        {this.props.children}
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
          <div className="row">
            {tournaments.map(this.renderTournament)}
          </div>
        </React.Fragment>
      )
    }
  }

  renderTournament = tournament => {
    const { id } = tournament
    return (
      <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={id}>
        <TournamentLinkBox to={this.props.buildLink(id)} tournament={tournament}/>
      </div>
    )
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
