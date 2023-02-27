import React, { useEffect, useState } from 'react'
import TournamentList from './tournament_list'
import { fetchTournaments } from './api_client'

const buildLink = tournament => `/t/${tournament.slug}`

const Index = () => {
  const [error, setError] = useState(false)
  const [tournaments, setTournaments] = useState(undefined)

  useEffect(() => {
    fetchTournaments({}, (err, data) => {
      if (err) {
        setError(true)
      } else {
        const tournaments = data.filter(t => !t.test)
        setTournaments(tournaments)
      }
    })
  }, [])

  return (
    <TournamentList
      buildLink={buildLink}
      showInfo={true}
      showSearch={true}
      title="fudisturnaus.com"
      tournaments={tournaments}
      tournamentsError={error}
    />
  )
}

export default Index
