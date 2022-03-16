import React, { useState } from 'react'
import TextField from '../form/text_field'
import Button from '../form/button'
import { sendContactRequest } from './api_client'
import FormErrors from '../form/form_errors'
import Message from '../components/message'

const genericIntro = 'Lähettäkää alla oleva lomake, niin hoidetaan asia kuntoon saman tien.'
const tournamentIntro = 'Jos tiedätte jo turnauksen tarkemmat tiedot, voitte täyttää ne valmiiksi tähän.'

const initialData = {
  name: '',
  contactInfo: '',
  message: '',
  tournamentOrganizer: '',
  tournamentName: '',
  tournamentStartDate: '',
  tournamentDays: 1,
  tournamentLocation: '',
}

const ContactForm = () => {
  const [errors, setErrors] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [data, setData] = useState(initialData)

  const renderIntro = (text) => {
    return <div className="form__intro">{text}</div>
  }

  const renderField = (label, field, type, placeholder) => {
    return <TextField
      label={label}
      onChange={setValue(field)}
      placeholder={placeholder}
      type={type}
      value={data[field]}/>
  }

  const renderMessageField = () => {
    return (
      <div className="form__field">
        <div className="label">Viesti</div>
        <textarea className="form__field" onChange={setValue('message')} cols={40} rows={10}/>
      </div>
    )
  }

  const setValue = field => event => setData({ ...data, [field]: event.target.value })

  const canSubmit = () => {
    const { name, contactInfo } = data
    return !!name && !!contactInfo
  }

  const submit = () => {
    sendContactRequest(data, errors => {
      if (errors) {
        return setErrors(errors)
      }
      setSubmitted(true)
    })
  }

  if (submitted) {
    return <Message type="success" noMargins={true}>Kiitos yhteydenotosta. Palaamme asiaan pian!</Message>
  }

  return (
    <form className="form form--vertical">
      <FormErrors errors={errors}/>
      {renderIntro(genericIntro)}
      {renderField('Nimi', 'name', 'text', 'Oma nimesi')}
      {renderField('Yhteystieto', 'contactInfo', 'text', 'Esim. sähköposti tai puhelin')}
      {renderMessageField()}
      {renderIntro(tournamentIntro)}
      {renderField('Turnauksen järjestävä seura', 'tournamentOrganizer', 'text')}
      {renderField('Turnauksen nimi', 'tournamentName', 'text')}
      {renderField('Pvm', 'tournamentStartDate', 'date')}
      {renderField('Kesto (pv)', 'tournamentDays', 'number')}
      {renderField('Paikka (kentän nimi)', 'tournamentLocation', 'text')}
      <div className="form__buttons">
        <Button label="Lähetä" onClick={submit} type="primary" disabled={!canSubmit()}/>
      </div>
    </form>
  )
}

export default ContactForm
