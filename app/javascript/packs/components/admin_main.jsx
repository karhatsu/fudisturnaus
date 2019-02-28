import React from 'react'
import ReactDOM from 'react-dom'
import Title from './title'
import AdminLoginPage from './AdminLoginPage'

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
      return <div>TODO</div>
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
    <AdminMain/>,
    document.getElementById('admin-app'),
  )
})
