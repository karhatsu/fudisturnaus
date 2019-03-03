import React from 'react'
import Loading from '../loading'
import TournamentLinkBox from '../tournament_link_box'
import { fetchTournaments } from '../api-client'

export default class AdminIndex extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      tournaments: undefined,
    }
  }

  render() {
    const { error, tournaments } = this.state
    if (error) {
      return <div className="message message--error">Virhe haettaessa turnauksia. Tarkasta verkkoyhteytesi ja lataa sivu uudestaan.</div>
    } else if (!tournaments) {
      return <Loading/>
    } else if (!tournaments.length) {
      return <div className="message message--error">Ei turnauksia</div>
    }
    return (
      <div className="tournament-links">
        {tournaments.map(this.renderTournament)}
      </div>
    )
  }

  renderTournament = tournament => {
    const { id } = tournament
    return <TournamentLinkBox key={id} to={`/admin/tournaments/${id}`} tournament={tournament}/>
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