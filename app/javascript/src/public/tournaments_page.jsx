import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import TournamentList from './tournament_list'
import { fetchTournaments } from './api_client'

const buildLink = (tournament) => `/t/${tournament.slug}`

export default function TournamentsPage() {
  const { search } = useLocation()
  const [error, setError] = useState(false)
  const [tournaments, setTournaments] = useState(undefined)

  useEffect(() => {
    fetchTournaments(search || {}, (err, data) => {
      if (err) {
        setError(true)
      } else {
        const tournaments = data.filter((t) => !t.test)
        setTournaments(tournaments)
      }
    })
  }, [search])

  return (
    <TournamentList
      buildLink={buildLink}
      title="fudisturnaus.com"
      tournaments={tournaments}
      tournamentsError={error}
      isPublic={true}
    />
  )
}
