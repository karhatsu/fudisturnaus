import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'

import '../styles/application.scss'
import TournamentPage, { officialLevels } from '../public/tournament_page'
import TournamentManagementPage from '../tournament_management/main'
import EditableMatch from './editable_match'
import AccessContext from '../util/access_context'

export default class OfficialMain extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        accessKey: PropTypes.string,
        resultsAccessKey: PropTypes.string,
      }).isRequired,
    }).isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  render() {
    const { match: { params: { accessKey, resultsAccessKey } } } = this.props
    return (
      <AccessContext.Provider value={{ officialAccessKey: accessKey, resultsAccessKey }}>
        <Switch>
          <Route path="/official/:accessKey/management" render={props => this.renderTournamentManagementPage(props)}/>
          <Route path="/official/:accessKey" render={props => this.renderTournamentPage(props, officialLevels.full)}/>
          <Route path="/results/:resultsAccessKey" render={props => this.renderTournamentPage(props, officialLevels.results)}/>
        </Switch>
      </AccessContext.Provider>
    )
  }

  renderTournamentManagementPage(routeProps) {
    const { match: { params: { accessKey } }, tournamentId } = this.props
    return <TournamentManagementPage {...routeProps} official={true} titleIconLink={`/official/${accessKey}`} tournamentId={tournamentId} />
  }

  renderTournamentPage(routeProps, officialLevel) {
    const { tournamentId } = this.props
    return (
      <TournamentPage
        {...routeProps}
        officialLevel={officialLevel}
        renderMatch={props => <EditableMatch {...props}/>}
        tournamentKey={tournamentId}
      />
    )
  }
}
