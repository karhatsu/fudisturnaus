import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { formatTournamentDates } from '../util/date_util'

const TournamentLinkBox = ({ to, tournament }) => {
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
    <Link to={to} key={id} className="tournament-link">
      {renderOrganizerLogo()}
      <div className="tournament-link__texts">
        <div className="tournament-link__tournament-name">{name}</div>
        <div className="tournament-link__other-info">{location}, {formatTournamentDates(startDate, endDate)}</div>
      </div>
      {renderBadge()}
    </Link>
  )
}

TournamentLinkBox.propTypes = {
  to: PropTypes.string.isRequired,
  tournament: PropTypes.shape({
    cancelled: PropTypes.bool.isRequired,
    club: PropTypes.shape({
      logoUrl: PropTypes.string,
    }),
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    test: PropTypes.bool.isRequired,
  }).isRequired,
}

export default TournamentLinkBox
