import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Title from './title'
import AdminLoginPage from './AdminLoginPage'
import AdminIndex from './admin/index'

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
        <Title text="fudisturnaus.com - ADMIN" loading={false}/>
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    if (this.state.sessionKey) {
      return (
        <Switch>
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

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BrowserRouter>
      <Route path="/admin" component={AdminMain} />
    </BrowserRouter>,
    document.getElementById('admin-app'),
  )
})
