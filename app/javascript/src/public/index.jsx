import React, { useEffect } from 'react'
import TournamentList from './tournament_list'
import { useAllTournaments } from './all_tournaments_context'

const buildLink = tournament => `/t/${tournament.slug}`

const Index = () => {
  const { fetchAllTournaments, tournaments, error } = useAllTournaments()

  useEffect(() => fetchAllTournaments(), [fetchAllTournaments])

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
