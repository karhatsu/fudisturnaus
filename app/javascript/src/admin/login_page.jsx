import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { loginToAdmin } from './api_client'
import Title from '../components/title'
import TextField from '../form/text_field'
import Button from '../form/button'
import Message from '../components/message'

const AdminLoginPage = ({ onSuccessfulLogin }) => {
  const [error, setError] = useState()
  const [data, setData] = useState({ username: '', password: '' })

  const renderError = () => {
    if (error) {
      return <Message type="error">{error}</Message>
    }
  }

  const renderField = (label, field, type) => {
    return <TextField field={field} label={label} onChange={setValue(field)} type={type} value={data[field]}/>
  }

  const renderSubmitButton = () => {
    return (
      <div className="form__buttons">
        <Button label="Kirjaudu sisään" onClick={submit} type="primary"/>
      </div>
    )
  }

  const setValue = field => e => setData({ ...data, [field]: e.target.value })

  const submit = () => {
    if (data.username && data.password) {
      loginToAdmin(data.username, data.password, (error, sessionKey) => {
        if (error) {
          setError(error)
        } else {
          onSuccessfulLogin(sessionKey)
        }
      })
    }
  }

  return (
    <form className="form form--vertical">
      <Title text="fudisturnaus.com" loading={false}/>
      <div className="login-form">
        {renderError()}
        {renderField('Käyttäjätunnus', 'username', 'text')}
        {renderField('Salasana', 'password', 'password')}
        {renderSubmitButton()}
      </div>
    </form>
  )
}

AdminLoginPage.propTypes = {
  onSuccessfulLogin: PropTypes.func.isRequired,
}

export default AdminLoginPage
