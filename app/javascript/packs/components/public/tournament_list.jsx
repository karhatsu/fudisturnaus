import React from 'react'
import PropTypes from 'prop-types'
import { addDays, endOfDay, endOfWeek, isAfter, isBefore, isSameDay, parseISO } from 'date-fns'

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
    showTestTournaments: PropTypes.bool.isRequired,
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
    const groups = this.groupTournaments(tournaments)
    return (
      <div className="tournament-links">
        {this.renderTournaments(groups.today, 'Turnaukset tänään')}
        {this.renderTournaments(groups.thisWeek, 'Turnaukset tällä viikolla')}
        {this.renderTournaments(groups.nextWeek, 'Turnaukset ensi viikolla')}
        {this.renderTournaments(groups.later, 'Turnaukset myöhemmin')}
        {this.renderTournaments(groups.past, 'Päättyneet turnaukset')}
      </div>
    )
  }

  groupTournaments = tournaments => {
    const groups = { today: [], thisWeek: [], nextWeek: [], later: [], past: [] }
    tournaments.forEach(tournament => {
      const startDate = parseISO(tournament.startDate)
      const endDate = parseISO(tournament.endDate)
      if (isBefore(endOfDay(endDate), new Date())) {
        groups.past.push(tournament)
      } else if (isSameDay(startDate, new Date()) || isSameDay(endDate, new Date())) {
        groups.today.push(tournament)
      } else if (isBefore(startDate, endOfWeek(new Date(), { weekStartsOn: 1 }))) {
        groups.thisWeek.unshift(tournament)
      } else if (isBefore(startDate, endOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }))) {
        groups.nextWeek.unshift(tournament)
      } else {
        groups.later.unshift(tournament)
      }
    })
    return groups
  }

  findThisWeekTournaments = tournaments => {
    return tournaments
      .filter(t => {
        const startDate = parseISO(t.startDate)
        return isAfter(startDate, new Date()) && isBefore(startDate, addDays(new Date(), 7))
      })
      .sort((a, b) => parseISO(a.startDate) - parseISO(b.startDate))
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
        <TournamentLinkBox to={this.props.buildLink(tournament)} tournament={tournament}/>
      </div>
    )
  }

  componentDidMount() {
    fetchTournaments((err, data) => {
      if (err) {
        this.setState({ error: true })
      } else {
        const tournaments = this.props.showTestTournaments ? data : data.filter(t => !t.test)
        this.setState({ tournaments })
      }
    })
  }
}
