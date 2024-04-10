import React, { useContext, useEffect, useMemo, useState } from 'react'
import AccessContext from '../util/access_context'
import { fetchClubs, refreshCache } from './api_client'
import FormErrors from '../form/form_errors'
import ClubForm from './club_form'
import Title from '../components/title'
import Message from '../components/message'
import TextField from '../form/text_field'
import { filterClubs } from '../util/club_util'

const ClubsManagementPage = () => {
  const [clubs, setClubs] = useState([])
  const [errors, setErrors] = useState([])
  const [cacheRefreshResponse, setCacheRefreshResponse] = useState()
  const [search, setSearch] = useState('')
  const accessContext = useContext(AccessContext)

  const clubsWithoutLogo = useMemo(() => clubs.filter(club => !club.logoUrl), [clubs])

  const filteredClubs = useMemo(() => {
    if (!search) return clubs
    return filterClubs(clubs, search)
  }, [clubs, search])

  useEffect(() => {
    fetchClubs(accessContext, (errors, response) => {
      if (errors) {
        setErrors(errors)
      } else {
        setErrors([])
        setClubs(response.clubs)
      }
    })
  }, [accessContext])

  const onClubDelete = id => {
    const newClubs = [...clubs]
    const clubIndex = newClubs.findIndex(club => club.id === id)
    newClubs.splice(clubIndex, 1)
    setClubs(newClubs)
  }

  const onClubSave = data => {
    const newClubs = [...clubs]
    const clubIndex = newClubs.findIndex(club => club.id === data.id)
    if (clubIndex !== -1) {
      newClubs[clubIndex] = { ...newClubs[clubIndex], ...data }
    } else {
      newClubs.push(data)
    }
    setClubs(newClubs.sort((a, b) => a.name.localeCompare(b.name)))
  }

  const renderCacheSection = () => {
    const messageType = cacheRefreshResponse === 'Done' ? 'success' : (cacheRefreshResponse ? 'error' : undefined)
    return (
      <div className="tournament-management__section">
        {cacheRefreshResponse && <Message type={messageType}>{cacheRefreshResponse}</Message>}
        <div className="tournament-item">
          <a href="#" onClick={handleRefresh}>Refresh cache</a>
        </div>
      </div>
    )
  }

  const handleRefresh = event => {
    event.preventDefault()
    refreshCache(accessContext, errors => {
      if (errors) {
        setCacheRefreshResponse(errors)
      } else {
        setCacheRefreshResponse('Done')
        setTimeout(() => {
          setCacheRefreshResponse()
        }, 3000)
      }
    })
  }

  return (
    <div>
      <Title iconLink="/admin" loading={!clubs.length} text="Seurat"/>
      <div className="title-2">Seurat ilman logoa</div>
      <div className="tournament-management__section">
        {clubsWithoutLogo.map(club => <ClubForm key={club.id} club={club} onClubDelete={onClubDelete} onClubSave={onClubSave}/>)}
      </div>
      <div className="title-2">Cache refresh</div>
      {renderCacheSection()}
      <div className="title-2">Uusi seura</div>
      <div className="tournament-management__section">
        <ClubForm onClubSave={onClubSave} />
      </div>
      <div className="title-2">Kaikki seurat</div>
      <div className="tournament-management__section">
        <TextField value={search} onChange={e => setSearch(e.target.value)} placeholder="Etsi..." />
        <FormErrors errors={errors}/>
        {filteredClubs.map(club => <ClubForm key={club.id} club={club} onClubDelete={onClubDelete} onClubSave={onClubSave}/>)}
      </div>
    </div>
  )
}

export default ClubsManagementPage
