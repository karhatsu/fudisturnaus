import React from 'react'
import TournamentList from './tournament_list'

export default class Index extends React.PureComponent {
  render() {
    return (
      <TournamentList
        buildLink={id => `/tournaments/${id}`}
        showInfo={true}
        showTestTournaments={false}
        title="fudisturnaus.com"
      />
    )
  }
}
