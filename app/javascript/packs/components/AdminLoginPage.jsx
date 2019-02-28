import React from 'react'
import PropTypes from 'prop-types'

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
      fetch('/api/v1/admin/admin_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }).then(response => {
        if (response.ok) {
          response.json().then(data => {
            console.log(data)
            this.props.onSuccessfulLogin(data.sessionKey)
          })
        } else if (response.status === 401) {
          this.setState({ error: 'Virheelliset tunnukset' })
        } else {
          this.setState({ error: 'Odottamaton virhe' })
        }
      }).catch(err => {
        console.error(err)// eslint-disable-line no-console
        this.setState({ error: 'Yhteysvirhe' })
      })
    }
  }
}
