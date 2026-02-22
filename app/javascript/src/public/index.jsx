import { useEffect } from 'react'
import TournamentList from './tournament_list'
import { useAllTournaments } from './all_tournaments_context'
import Hero from './hero'

const buildLink = (tournament) => `/t/${tournament.slug}`

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
      isPublic={true}
    >
      <Hero />
    </TournamentList>
  )
}

export default Index
