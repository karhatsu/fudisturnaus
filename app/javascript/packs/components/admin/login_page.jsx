import React from 'react'
import PropTypes from 'prop-types'
import { loginToAdmin } from '../api-client'
import Title from '../title'

export default class AdminLoginPage extends React.PureComponent {
  static propTypes = {
    onSuccessfulLogin: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      error: undefined,
      username: '',
      password: '',
    }
  }

  render() {
    return (
      <div>
        <Title text="fudisturnaus.com" loading={false}/>
        {this.renderError()}
        {this.renderField('Käyttäjätunnus', 'username', 'text')}
        {this.renderField('Salasana', 'password', 'password')}
        {this.renderSubmitButton()}
      </div>
    )
  }

  renderError() {
    const { error } = this.state
    if (error) {
      return <div className="message message--error">{error}</div>
    }
  }

  renderField(label, field, type) {
    return (
      <div className="row field">
        <div className="col-xs-12 col-sm-2 label">{label}</div>
        <div className="col-xs-12 col-sm-10"><input type={type} value={this.state[field]} onChange={this.setValue(field)}/></div>
      </div>
    )
  }

  renderSubmitButton() {
    return (
      <div className="row submit-button">
        <div className="col-xs-12">
          <input type="submit" value="Kirjaudu sisään" onClick={this.submit}/>
        </div>
      </div>
    )
  }

  setValue = field => {
    return e => {
      this.setState({ [field]: e.target.value })
    }
  }

  submit = () => {
    const { username, password } = this.state
    if (username && password) {
      loginToAdmin(username, password, (error, sessionKey) => {
        if (error) {
          this.setState({ error })
        } else {
          this.props.onSuccessfulLogin(sessionKey)
        }
      })
    }
  }
}
