import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { formatTournamentDates } from '../util/util'

export default class TournamentLinkBox extends React.PureComponent {
  static propTypes = {
    to: PropTypes.string.isRequired,
    tournament: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
    }).isRequired,
  }

  render() {
    const { to, tournament: { id, name, location, startDate, endDate } } = this.props
    return (
      <Link to={to} key={id} className="tournament-link">
        <div className="tournament-link__tournament-name">{name}</div>
        <div>{location}, {formatTournamentDates(startDate, endDate)}</div>
      </Link>
    )
  }
}
