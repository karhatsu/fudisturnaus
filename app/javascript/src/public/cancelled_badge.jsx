import React from 'react'

const CancelledBadge = ({ tournament }) => {
  if (tournament && tournament.cancelled) {
    return <div className="badge badge--0">Turnaus peruttu</div>
  }
  return null
}

export default CancelledBadge
