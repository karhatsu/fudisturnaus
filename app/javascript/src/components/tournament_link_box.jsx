import React from 'react'
import { Link } from 'react-router'
import { formatTournamentDates } from '../util/date_util'

const TournamentLinkBox = ({ to, tournament, reloadDocument }) => {
  const { cancelled, club, id, name, location, startDate, endDate, test } = tournament

  const renderOrganizerLogo = () => {
    if (club && club.logoUrl) {
      return (
        <div className="tournament-link__club-logo">
          <img src={club.logoUrl} />
        </div>
      )
    }
  }

  const renderBadge = () => {
    if (cancelled || test) {
      const text = test ? 'Testi' : 'Peruttu'
      const level = test ? 1 : 0
      return <div className={`badge badge--${level}`}>{text}</div>
    }
  }

  return (
    <Link to={to} key={id} className="tournament-link" reloadDocument={reloadDocument}>
      {renderOrganizerLogo()}
      <div className="tournament-link__texts">
        <div className="tournament-link__tournament-name">{name}</div>
        <div className="tournament-link__other-info">
          {location}, {formatTournamentDates(startDate, endDate)}
        </div>
      </div>
      {renderBadge()}
    </Link>
  )
}

export default TournamentLinkBox
