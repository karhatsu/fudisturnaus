import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import OfficialMain from './src/official/main'

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('initial-data')
  const props = JSON.parse(node.getAttribute('data'))
  const { tournamentId } = props
  ReactDOM.render(
    <BrowserRouter>
      <Switch>
        <Route path="/official/:accessKey" render={routeProps => <OfficialMain {...routeProps} tournamentId={tournamentId} />}/>
        <Route path="/results/:resultsAccessKey" render={routeProps => <OfficialMain {...routeProps} tournamentId={tournamentId} />}/>
      </Switch>
    </BrowserRouter>,
    document.getElementById('official-app')
  )
})
