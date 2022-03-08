import React from 'react'
import TournamentList from './tournament_list'

const buildLink = tournament => `/t/${tournament.slug}`

const Index = () => {
  return (
    <TournamentList
      buildLink={buildLink}
      showInfo={true}
      showTestTournaments={false}
      title="fudisturnaus.com"
    />
  )
}

export default Index
