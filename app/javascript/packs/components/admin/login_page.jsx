import React from 'react'
import PropTypes from 'prop-types'
import { loginToAdmin } from './api_client'
import Title from '../components/title'
import TextField from '../form/text_field'
import Button from '../form/button'

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
      <div className="form form--vertical">
        <Title text="fudisturnaus.com" loading={false}/>
        <div className="login-form">
          {this.renderError()}
          {this.renderField('Käyttäjätunnus', 'username', 'text')}
          {this.renderField('Salasana', 'password', 'password')}
          {this.renderSubmitButton()}
        </div>
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
    return <TextField label={label} onChange={this.setValue(field)} type={type} value={this.state[field]}/>
  }

  renderSubmitButton() {
    return (
      <div className="form__buttons">
        <Button label="Kirjaudu sisään" onClick={this.submit} type="primary"/>
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
