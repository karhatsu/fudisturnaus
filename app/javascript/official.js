import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import OfficialMain from './src/official/main'

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('initial-data')
  const props = JSON.parse(node.getAttribute('data'))
  const tournamentId = parseInt(props.tournamentId)
  const refereeId = props.refereeId && parseInt(props.refereeId)
  const refereeName = props.refereeName
  const root = createRoot(document.getElementById('official-app'))
  root.render(
    <BrowserRouter>
      <Switch>
        <Route path="/official/:accessKey" render={() => <OfficialMain tournamentId={tournamentId} />}/>
        <Route path="/results/:resultsAccessKey" render={() => <OfficialMain tournamentId={tournamentId} />}/>
        <Route path="/referees/:refereeAccessKey" render={() => {
          return <OfficialMain tournamentId={tournamentId} refereeId={refereeId} refereeName={refereeName} />
        }}/>
      </Switch>
    </BrowserRouter>
  )
})
