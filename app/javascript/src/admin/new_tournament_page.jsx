import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import TournamentFields from '../tournament_management/tournament_fields'
import { createTournament, fetchClubs } from './api_client'
import AccessContext from '../util/access_context'

const NewTournamentPage = () => {
  const accessContext = useContext(AccessContext)
  const [clubs, setClubs] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    fetchClubs(accessContext, (errors, response) => {
      if (errors) {
        console.error(errors)
      } else {
        setClubs(response.clubs)
      }
    })
  }, [accessContext])

  const onSave = (data, callback) => {
    createTournament(accessContext, data, (errors, response) => {
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
        {clubs && <TournamentFields clubs={clubs} onCancel={goToIndex} onSave={onSave} official={false} />}
      </div>
    </div>
  )
}

export default NewTournamentPage
