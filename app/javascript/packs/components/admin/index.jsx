import React from 'react'
import { Link } from 'react-router-dom'
import TournamentList from '../public/tournament_list'

export default class AdminIndex extends React.PureComponent {
  render() {
    return (
      <TournamentList buildLink={id => `/admin/tournaments/${id}`} title="Admin">
        <div className="title-2">Uusi turnaus</div>
        <div className="tournament-management__section">
          <Link to="/admin/tournaments/new">+ Lisää uusi turnaus</Link>
        </div>
      </TournamentList>
    )
  }
}
