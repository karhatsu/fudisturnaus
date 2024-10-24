import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { formatDateTime } from '../util/date_util'
import { Link } from 'react-router-dom'

const ContactItem = ({ contact, updateAsHandled }) => {
  const {
    id,
    handledAt,
    personName,
    email,
    message,
    tournamentClub,
    tournamentName,
    tournamentStartDate,
    tournamentDays,
    tournamentLocation,
    createdAt,
  } = contact

  const onHandled = useCallback(event => {
    event.preventDefault()
    updateAsHandled(id)
  }, [id, updateAsHandled])

  const fields = [message, tournamentClub, tournamentName, tournamentStartDate, tournamentDays, tournamentLocation]
  return (
    <div className="tournament-management__section">
      {handledAt && `✅ ${formatDateTime(handledAt)} | `}
      {formatDateTime(createdAt)} | {personName} | <a href={`mailto:${email}`}>{email}</a> | {fields.filter(f => f).join(', ')}
      {!handledAt && (
        <div>
          <Link to={`/admin/tournaments/new?contact_id=${id}`}>Lisää turnaus</Link>
          {' '}
          <a href="" onClick={onHandled}>Merkitse käsitellyksi</a>
        </div>
      )}
    </div>
  )
}

ContactItem.propTypes = {
  contact: PropTypes.object.isRequired,
  updateAsHandled: PropTypes.func.isRequired,
}

export default ContactItem
