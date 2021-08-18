import React from 'react'
import TournamentList from './tournament_list'

const buildLink = tournament => `/t/${tournament.slug}`

export default class Index extends React.PureComponent {
  render() {
    return (
      <TournamentList
        buildLink={buildLink}
        showInfo={true}
        showTestTournaments={false}
        title="fudisturnaus.com"
      />
    )
  }
}
