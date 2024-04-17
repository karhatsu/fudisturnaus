import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TournamentList from '../public/tournament_list'
import { fetchTournaments } from '../public/api_client'
import { fetchUnhandledContactCount } from './api_client'
import AccessContext from '../util/access_context'

const buildLink = tournament => `/admin/tournaments/${tournament.id}`

const AdminIndex = () => {
  const [error, setError] = useState(false)
  const [tournaments, setTournaments] = useState(undefined)
  const [search, setSearch] = useState('')
  const [unhandledContacts, setUnhandledContacts] = useState('...')
  const accessContext = useContext(AccessContext)

  useEffect(() => {
    fetchTournaments({}, (err, data) => {
      if (err) {
        setError(true)
      } else {
        setTournaments(data)
      }
    })
    fetchUnhandledContactCount(accessContext, (err, data) => {
      if (err) {
        setUnhandledContacts(err)
      } else {
        setUnhandledContacts(data.count)
      }
    })
  }, [accessContext])

  return (
    <TournamentList
      buildLink={buildLink}
      search={search}
      setSearch={setSearch}
      title="Admin"
      tournaments={tournaments}
      tournamentsError={error}
    >
      <div className="title-2">Hallinta</div>
      <div className="tournament-management__section">
        <Link to="tournaments/new">+ Lisää uusi turnaus</Link>
      </div>
      <div className="tournament-management__section">
        <Link to="clubs">Seurat</Link>
      </div>
      <div className="tournament-management__section">
        <Link to="contacts">Yhteydenotot</Link> ({unhandledContacts})
      </div>
    </TournamentList>
  )
}

export default AdminIndex
