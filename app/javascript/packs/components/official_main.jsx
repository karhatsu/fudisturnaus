import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import TournamentPage from './tournament_page'
import './styles/application.scss'
import AccessContext from './access_context'

export default class OfficialMain extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        accessKey: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  render() {
    const { match: { params: { accessKey } }, tournamentId } = this.props
    return (
      <AccessContext.Provider value={{ officialAccessKey: accessKey }}>
        <Switch>
          <Route path="/official/:accessKey" render={props => <TournamentPage {...props} official={true} tournamentId={tournamentId}/>}/>
        </Switch>
      </AccessContext.Provider>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('initial-data')
  const props = JSON.parse(node.getAttribute('data'))
  const { tournamentId } = props
  ReactDOM.render(
    <BrowserRouter>
      <Route path="/official/:accessKey" render={routeProps => <OfficialMain {...routeProps} tournamentId={tournamentId} />}/>
    </BrowserRouter>,
    document.getElementById('official-app')
  )
})
