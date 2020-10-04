import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { formatTournamentDates } from '../util/date_util'

export default class TournamentLinkBox extends React.PureComponent {
  static propTypes = {
    to: PropTypes.string.isRequired,
    tournament: PropTypes.shape({
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

  render() {
    const { to, tournament: { club, id, name, location, startDate, endDate, test } } = this.props
    const tournamentName = test ? `${name} (testi)` : name
    return (
      <Link to={to} key={id} className="tournament-link">
        {this.renderOrganizerLogo(club)}
        <div className="tournament-link__texts">
          <div className="tournament-link__tournament-name">{tournamentName}</div>
          <div className="tournament-link__other-info">{location}, {formatTournamentDates(startDate, endDate)}</div>
        </div>
      </Link>
    )
  }

  renderOrganizerLogo(club) {
    if (club && club.logoUrl) {
      return (
        <div className="tournament-link__club-logo">
          <img src={club.logoUrl} />
        </div>
      )
    }
  }
}
