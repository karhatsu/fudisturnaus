import React from 'react'
import { useLocation } from 'react-router'
import TournamentList from './tournament_list'

const buildLink = tournament => `/t/${tournament.slug}`

export default function TournamentsPage() {
  const { search } = useLocation()
  return (
    <TournamentList
      buildLink={buildLink}
      title="fudisturnaus.com"
      showTestTournaments={false}
      showInfo={false}
      query={search}
    />
  )
}
