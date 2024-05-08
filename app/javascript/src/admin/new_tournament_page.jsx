import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import TournamentFields from '../tournament_management/tournament_fields'
import { createTournament, fetchClubs, fetchContact } from './api_client'
import AccessContext from '../util/access_context'
import { visibilityTypes } from '../util/enums'

const emptyTournament = {
  cancelled: false,
  clubId: undefined,
  name: '',
  startDate: '',
  days: 1,
  location: '',
  address: '',
  matchMinutes: 30,
  equalPointsRule: 1,
  visibility: visibilityTypes.teams,
  info: '',
}

const NewTournamentPage = () => {
  const accessContext = useContext(AccessContext)
  const [clubs, setClubs] = useState()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [initialTournament, setInitialTournament] = useState()
  const [clubName, setClubName] = useState()
  const contactId = searchParams.get('contact_id')

  useEffect(() => {
    fetchClubs(accessContext, (errors, response) => {
      if (errors) {
        console.error(errors)
      } else {
        setClubs(response.clubs)
      }
    })
  }, [accessContext])

  useEffect(() => {
    if (contactId) {
      fetchContact(accessContext, contactId, (err, contact) => {
        if (err) {
          console.error(err)
          return
        }
        setInitialTournament({
          ...emptyTournament,
          name: contact.tournamentName || '',
          startDate: contact.tournamentStartDate?.substring(0, 10) || '',
          days: contact.tournamentDays || 1,
          location: contact.tournamentLocation || '',
        })
        setClubName(contact.tournamentClub)
      })
    } else {
      setInitialTournament(emptyTournament)
    }
  }, [accessContext, contactId])

  const onSave = (data, callback) => {
    createTournament(accessContext, data, contactId, (errors, response) => {
      if (errors) {
        callback(errors)
      } else {
        goToTournamentPage(response.id)
      }
    })
  }

  const goToTournamentPage = id => {
    navigate(`/admin/tournaments/${id}`)
  }

  const goToIndex = () => {
    navigate('/admin')
  }

  return (
    <div>
      <div className="title">Uusi turnaus</div>
      <div className="tournament-management__section">
        {clubs && initialTournament && (
          <TournamentFields
            contactId={contactId}
            clubName={clubName}
            clubs={clubs}
            onCancel={goToIndex}
            onSave={onSave}
            official={false}
            tournament={initialTournament}
          />
        )}
      </div>
    </div>
  )
}

export default NewTournamentPage
