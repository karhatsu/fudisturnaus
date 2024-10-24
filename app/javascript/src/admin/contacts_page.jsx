import React, { useCallback, useContext, useEffect, useState } from 'react'
import Title from '../components/title'
import AccessContext from '../util/access_context'
import { fetchContacts, updateContactHandledAt } from './api_client'
import FormErrors from '../form/form_errors'
import ContactItem from './contact_item'

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

  const updateAsHandled = useCallback((id) => {
    updateContactHandledAt(accessContext, id, (err, contact) => {
      if (err) {
        console.error(err)
        return
      }
      setContacts(prev => {
        const newContacts = [...prev]
        const index = newContacts.findIndex(c => c.id === id)
        newContacts[index] = contact
        return newContacts
      })
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
      {contacts?.map(contact => <ContactItem key={contact.id} contact={contact} updateAsHandled={updateAsHandled} />)}
    </div>
  )
}

export default ContactsPage
