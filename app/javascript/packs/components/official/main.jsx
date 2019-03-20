import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import '../styles/application.scss'
import TournamentPage from '../public/tournament_page'
import TournamentManagementPage from '../tournament_management/main'
import EditableMatch from './editable_match'
import AccessContext from '../util/access_context'

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
    const { match: { params: { accessKey } } } = this.props
    return (
      <AccessContext.Provider value={{ officialAccessKey: accessKey }}>
        <Switch>
          <Route path="/official/:accessKey/management" render={props => this.renderTournamentManagementPage(props)}/>
          <Route path="/official/:accessKey" render={props => this.renderTournamentPage(props)}/>
        </Switch>
      </AccessContext.Provider>
    )
  }

  renderTournamentManagementPage(routeProps) {
    const { match: { params: { accessKey } }, tournamentId } = this.props
    return <TournamentManagementPage {...routeProps} official={true} titleIconLink={`/official/${accessKey}`} tournamentId={tournamentId} />
  }

  renderTournamentPage(routeProps) {
    const { tournamentId } = this.props
    return <TournamentPage {...routeProps} official={true} renderMatch={props => <EditableMatch {...props}/>} tournamentId={tournamentId}/>
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
