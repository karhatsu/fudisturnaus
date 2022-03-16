import React from 'react'
import { useParams } from 'react-router'
import { Route } from 'react-router-dom'
import '../styles/application.scss'
import Index from './index'
import TournamentPage, { officialLevels } from './tournament_page'
import Match from './match'
import Info from './info'
import TournamentsPage from './tournaments_page'

const Main = () => {
  return (
    <div>
      <Route path="/info" component={Info}/>
      <Route path="/t/:key" component={TournamentPageWrapper} />
      <Route path="/tournaments/:key" component={TournamentPageWrapper} />
      <Route path="/tournaments" component={TournamentsPage} />
      <Route path="/" exact component={Index} />
    </div>
  )
}

const TournamentPageWrapper = props => {
  const { key } = useParams()
  return (
    <TournamentPage
      {...props}
      officialLevel={officialLevels.none}
      renderMatch={props => <Match {...props}/>}
      tournamentKey={key}
    />
  )
}

export default Main
