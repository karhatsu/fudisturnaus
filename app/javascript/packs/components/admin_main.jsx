import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import AdminLoginPage from './AdminLoginPage'
import AdminIndex from './admin/index'
import AdminTournamentPage from './admin/tournament_page'
import PropTypes from 'prop-types'

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
    if (this.state.sessionKey) {
      return (
        <Switch>
          <Route path="/admin/tournaments/:id" component={AdminTournamentPageWrapper} />
          <Route path="/admin" component={AdminIndex} exact />
        </Switch>
      )
    } else {
      return <AdminLoginPage onSuccessfulLogin={this.onSuccessfulLogin}/>
    }
  }

  onSuccessfulLogin = sessionKey => {
    this.setState({ sessionKey })
  }
}

class AdminTournamentPageWrapper extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  render() {
    const { match: { params: { id } } } = this.props
    return <AdminTournamentPage tournamentId={parseInt(id)}/>
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
