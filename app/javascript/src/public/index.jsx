import React, { useEffect } from 'react'
import TournamentList from './tournament_list'
import { useAllTournaments } from './all_tournaments_context'
import InfoBox from './info_box'

const buildLink = tournament => `/t/${tournament.slug}`

const Index = () => {
  const { fetchAllTournaments, tournaments, error, search, setSearch } = useAllTournaments()

  useEffect(() => fetchAllTournaments(), [fetchAllTournaments])

  return (
    <TournamentList
      buildLink={buildLink}
      search={search}
      setSearch={setSearch}
      title="fudisturnaus.com"
      tournaments={tournaments}
      tournamentsError={error}
    >
      <InfoBox/>
    </TournamentList>
  )
}

export default Index
