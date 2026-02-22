import { useCallback, useState } from 'react'
import { formatDateTime } from '../util/date_util'
import { Link } from 'react-router'

const messageCut = 100

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
  const longMessage = message.length > messageCut
  const [fullText, setFullText] = useState(!longMessage)

  const toggleMessage = useCallback((event) => {
    event.preventDefault()
    setFullText((full) => !full)
  }, [])

  const onHandled = useCallback(
    (event) => {
      event.preventDefault()
      updateAsHandled(id)
    },
    [id, updateAsHandled],
  )

  const fields = [tournamentClub, tournamentName, tournamentStartDate, tournamentDays, tournamentLocation]
  const mailto = `mailto:${email}?subject=${encodeURIComponent(tournamentName)}`
  return (
    <div className="tournament-management__section contact-item">
      {handledAt && <div className="contact-item__data">✅ {formatDateTime(handledAt)}</div>}
      <div className="contact-item__data">{formatDateTime(createdAt)}</div>
      <div className="contact-item__data">
        {personName}, <a href={mailto}>{email}</a>
      </div>
      {fields
        .filter((f) => f)
        .map((f, i) => (
          <div key={i} className="contact-item__data">
            {f}
          </div>
        ))}
      {message && (
        <div className="contact-item__data">
          {fullText ? message : `${message.substring(0, messageCut)}... `}
          {longMessage && (
            <a href="" onClick={toggleMessage}>
              {fullText ? 'Piilota viesti' : 'Näytä koko viesti'}
            </a>
          )}
        </div>
      )}
      {!handledAt && (
        <>
          <div className="contact-item__data">
            <Link to={`/admin/tournaments/new?contact_id=${id}`}>Lisää turnaus</Link>
          </div>
          <div className="contact-item__data">
            <a href="" onClick={onHandled}>
              Merkitse käsitellyksi
            </a>
          </div>
        </>
      )}
    </div>
  )
}

export default ContactItem
