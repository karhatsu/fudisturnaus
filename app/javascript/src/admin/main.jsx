import React, { useCallback, useState } from 'react'
import { Route, Switch } from 'react-router-dom'

import AdminLoginPage from './login_page'
import AdminIndex from './index'
import ClubsManagementPage from './clubs_management_page'
import NewTournamentPage from './new_tournament_page'
import TournamentManagementPage from '../tournament_management/main'
import AccessContext from '../util/access_context'

const AdminMain = () => {
  const [sessionKey, setSessionKey] = useState()

  const onSuccessfulLogin = useCallback(sessionKey => {
    setSessionKey(sessionKey)
  }, [])

  if (!sessionKey) {
    return <AdminLoginPage onSuccessfulLogin={onSuccessfulLogin}/>
  }

  return (
    <AccessContext.Provider value={{ adminSessionKey: sessionKey }}>
      <Switch>
        <Route path="/admin/clubs" component={ClubsManagementPage}/>
        <Route path="/admin/tournaments/new" component={NewTournamentPage}/>
        <Route path="/admin/tournaments/:id" render={props => <TournamentManagementPage {...props} official={false} titleIconLink="/admin"/>} />
        <Route path="/admin" component={AdminIndex} exact />
      </Switch>
    </AccessContext.Provider>
  )
}

export default AdminMain
