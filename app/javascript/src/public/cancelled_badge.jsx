import React from 'react'
import PropTypes from 'prop-types'

const CancelledBadge = ({ tournament }) => {
  if (tournament && tournament.cancelled) {
    return <div className="badge badge--0">Turnaus peruttu</div>
  }
  return null
}

CancelledBadge.propTypes = {
  tournament: PropTypes.shape({
    cancelled: PropTypes.bool.isRequired,
  }),
}

export default CancelledBadge
