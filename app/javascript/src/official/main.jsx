import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router'
import { Route, Switch } from 'react-router-dom'

import '../styles/application.scss'
import TournamentPage, { officialLevels } from '../public/tournament_page'
import TournamentManagementPage from '../tournament_management/main'
import EditableMatch from './editable_match'
import AccessContext from '../util/access_context'

const OfficialMain = ({ tournamentId }) => {
  const { accessKey, resultsAccessKey } = useParams()

  const renderTournamentManagementPage = routeProps => {
    return (
      <TournamentManagementPage
        {...routeProps}
        official={true}
        titleIconLink={`/official/${accessKey}`}
        tournamentId={tournamentId}
      />
    )
  }

  const renderTournamentPage = (routeProps, officialLevel) => {
    return (
      <TournamentPage
        {...routeProps}
        officialLevel={officialLevel}
        renderMatch={props => <EditableMatch {...props}/>}
        tournamentKey={tournamentId}
      />
    )
  }

  return (
    <AccessContext.Provider value={{ officialAccessKey: accessKey, resultsAccessKey }}>
      <Switch>
        <Route path="/official/:accessKey/management" render={props => renderTournamentManagementPage(props)}/>
        <Route path="/official/:accessKey" render={props => renderTournamentPage(props, officialLevels.full)}/>
        <Route path="/results/:resultsAccessKey" render={props => renderTournamentPage(props, officialLevels.results)}/>
      </Switch>
    </AccessContext.Provider>
  )
}

OfficialMain.propTypes = {
  tournamentId: PropTypes.number.isRequired,
}

export default OfficialMain
