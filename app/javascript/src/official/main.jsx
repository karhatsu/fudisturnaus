import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router'
import { Route, Switch } from 'react-router-dom'

import '../styles/application.scss'
import TournamentPage, { officialLevels } from '../public/tournament_page'
import TournamentManagementPage from '../tournament_management/main'
import EditableMatch from './editable_match'
import AccessContext from '../util/access_context'
import RefereePage from './referee_page'

const OfficialMain = ({ tournamentId, refereeId, refereeName }) => {
  const { accessKey, resultsAccessKey, refereeAccessKey } = useParams()

  const renderTournamentManagementPage = () => {
    return (
      <TournamentManagementPage
        official={true}
        titleIconLink={`/official/${accessKey}`}
        tournamentId={tournamentId}
      />
    )
  }

  const renderTournamentPage = (officialLevel) => {
    return (
      <TournamentPage
        officialLevel={officialLevel}
        renderMatch={props => <EditableMatch {...props}/>}
        tournamentKey={tournamentId}
      />
    )
  }

  const renderRefereePage = () => {
    return <RefereePage tournamentId={tournamentId} refereeId={refereeId} refereeName={refereeName} />
  }

  return (
    <AccessContext.Provider value={{ officialAccessKey: accessKey, resultsAccessKey, refereeAccessKey }}>
      <Switch>
        <Route path="/official/:accessKey/management" render={renderTournamentManagementPage}/>
        <Route path="/official/:accessKey" render={() => renderTournamentPage(officialLevels.full)}/>
        <Route path="/results/:resultsAccessKey" render={() => renderTournamentPage(officialLevels.results)}/>
        <Route path="/referees/:refereeAccessKey" render={renderRefereePage} />
      </Switch>
    </AccessContext.Provider>
  )
}

OfficialMain.propTypes = {
  tournamentId: PropTypes.number.isRequired,
  refereeId: PropTypes.number,
  refereeName: PropTypes.string,
}

export default OfficialMain
