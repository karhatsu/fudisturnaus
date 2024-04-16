import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/title'
import AccessContext from '../util/access_context'
import { fetchContacts } from './api_client'
import FormErrors from '../form/form_errors'
import { formatDateTime } from '../util/date_util'
import { Link } from "react-router-dom"

const ContactsPage = () => {
  const accessContext = useContext(AccessContext)
  const [contacts, setContacts] = useState()
  const [errors, setErrors] = useState([])

  useEffect(() => {
    fetchContacts(accessContext, (errors, response) => {
      if (errors) {
        setErrors(errors)
      } else {
        setErrors([])
        setContacts(response.contacts)
      }
    })
  }, [accessContext])

  return (
    <div>
      <Title iconLink="/admin" loading={!contacts} text="Yhteydenotot" />
      {errors.length > 0 && (
        <div className="tournament-management__section">
          <FormErrors errors={errors} />
        </div>
      )}
      {contacts?.map(contact => {
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
        const fields = [message, tournamentClub, tournamentName, tournamentStartDate, tournamentDays, tournamentLocation]
        return (
          <div key={id} className="tournament-management__section">
            {handledAt && `✅ ${formatDateTime(handledAt)} | `}
            {formatDateTime(createdAt)} | {personName} | <a href={`mailto:${email}`}>{email}</a> | {fields.filter(f => f).join(', ')}
            {!handledAt && (
              <div>
                <Link to={`/admin/tournaments/new?contact_id=${id}`}>Lisää turnaus</Link>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ContactsPage
