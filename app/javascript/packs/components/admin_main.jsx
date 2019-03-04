import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import AdminLoginPage from './admin/login_page'
import AdminIndex from './admin/index'
import AdminTournamentPage from './admin/tournament_page'
import AdminSessionKeyContext from './admin/session_key_context'

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
        <AdminSessionKeyContext.Provider value={sessionKey}>
          <Switch>
            <Route path="/admin/tournaments/:id" component={AdminTournamentPage} />
            <Route path="/admin" component={AdminIndex} exact />
          </Switch>
        </AdminSessionKeyContext.Provider>
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
