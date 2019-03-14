import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import AdminLoginPage from './login_page'
import AdminIndex from './index'
import TournamentManagementPage from '../tournament_management/main'
import AccessContext from '../access_context'

export default class AdminMain extends React.PureComponent {
  static propTypes = {
  }

  constructor(props) {
    super(props)
    this.state = {
      sessionKey: undefined,
    }
  }

  render() {
    return (
      <div>
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    const { sessionKey } = this.state
    if (sessionKey) {
      return (
        <AccessContext.Provider value={{ adminSessionKey: sessionKey }}>
          <Switch>
            <Route path="/admin/tournaments/:id" render={props => <TournamentManagementPage {...props} titleIconLink="/admin"/>} />
            <Route path="/admin" component={AdminIndex} exact />
          </Switch>
        </AccessContext.Provider>
      )
    } else {
      return <AdminLoginPage onSuccessfulLogin={this.onSuccessfulLogin}/>
    }
  }

  onSuccessfulLogin = sessionKey => {
    this.setState({ sessionKey })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BrowserRouter>
      <Route path="/admin" component={AdminMain} />
    </BrowserRouter>,
    document.getElementById('admin-app'),
  )
})
