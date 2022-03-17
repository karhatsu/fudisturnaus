import React, { useContext, useEffect, useState } from 'react'
import AccessContext from '../util/access_context'
import { fetchClubs, refreshCache } from './api_client'
import FormErrors from '../form/form_errors'
import ClubForm from './club_form'
import Title from '../components/title'
import Message from '../components/message'

const ClubsManagementPage = () => {
  const [clubs, setClubs] = useState([])
  const [errors, setErrors] = useState([])
  const [cacheRefreshResponse, setCacheRefreshResponse] = useState()
  const accessContext = useContext(AccessContext)

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
    newClubs[clubIndex] = { ...newClubs[clubIndex], ...data }
    setClubs(newClubs.sort((a, b) => a.name.localeCompare(b.name)))
  }

  const renderCacheSection = () => {
    const messageType = cacheRefreshResponse === 'Done' ? 'success' : (cacheRefreshResponse ? 'error' : undefined)
    return (
      <div className="tournament-management__section">
        {cacheRefreshResponse && <Message type={messageType}>{cacheRefreshResponse}</Message>}
        <a href="#" onClick={handleRefresh}>Refresh cache</a>
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
      <div className="tournament-management__section">
        <FormErrors errors={errors}/>
        {clubs.map(club => <ClubForm key={club.id} club={club} onClubDelete={onClubDelete} onClubSave={onClubSave}/>)}
      </div>
      <div className="title-2">Cache refresh</div>
      {renderCacheSection()}
    </div>
  )
}

export default ClubsManagementPage
