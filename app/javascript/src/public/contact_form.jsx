import { useCallback, useState } from 'react'
import TextField from '../form/text_field'
import Button from '../form/button'
import { sendContactRequest } from './api_client'
import FormErrors from '../form/form_errors'
import Message from '../components/message'
import { pricePerTeam } from '../util/util'

const genericIntro = 'Lähettäkää alla oleva lomake, niin hoidetaan asia kuntoon saman tien.'

const initialData = {
  personName: '',
  email: '',
  message: '',
  tournamentClub: '',
  tournamentName: '',
  tournamentStartDate: '',
  tournamentDays: 1,
  tournamentLocation: '',
}

const ContactForm = () => {
  const [errors, setErrors] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [data, setData] = useState(initialData)

  const setValue = useCallback((field) => (event) => setData((data) => ({ ...data, [field]: event.target.value })), [])

  const setCheckboxValue = useCallback(
    (field) => (event) => setData((data) => ({ ...data, [field]: event.target.checked })),
    [],
  )

  const renderIntro = (text) => {
    return <div className="form__intro">{text}</div>
  }

  const renderField = (label, field, type, placeholder) => {
    return (
      <TextField label={label} onChange={setValue(field)} placeholder={placeholder} type={type} value={data[field]} />
    )
  }

  const renderMessageField = () => {
    return (
      <div className="form__field">
        <div className="label">Lisätietoa turnauksesta</div>
        <textarea className="form__field" onChange={setValue('message')} cols={40} rows={10} />
      </div>
    )
  }

  const renderPremiumField = () => (
    <div className="form__field">
      <div className="label">Premium</div>
      <input type="checkbox" onChange={setCheckboxValue('premium')} checked={!!data.premium} />
      Turnaussivu ilman mainoksia ({pricePerTeam} &euro; / osallistuva joukkue, sis. alv)
    </div>
  )

  const canSubmit = () => {
    const { personName, email } = data
    return !!personName && !!email
  }

  const submit = () => {
    sendContactRequest(data, (errors) => {
      if (errors) {
        return setErrors(errors)
      }
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <Message type="success" noMargins={true}>
        Kiitos yhteydenotosta. Palaamme asiaan pian!
      </Message>
    )
  }

  return (
    <form className="form form--vertical">
      <FormErrors errors={errors} />
      {renderIntro(genericIntro)}
      {renderField('Nimi', 'personName', 'text', 'Oma nimesi')}
      {renderField('Sähköposti', 'email', 'email', 'Sähköposti')}
      {renderField('Turnauksen järjestävä seura', 'tournamentClub', 'text')}
      {renderField('Turnauksen nimi', 'tournamentName', 'text')}
      {renderField('Pvm', 'tournamentStartDate', 'date')}
      {renderField('Kesto (pv)', 'tournamentDays', 'number')}
      {renderField('Paikka (kentän nimi)', 'tournamentLocation', 'text')}
      {renderPremiumField()}
      {renderMessageField()}
      <div className="form__buttons">
        <Button label="Lähetä" onClick={submit} type="primary" disabled={!canSubmit()} />
      </div>
    </form>
  )
}

export default ContactForm
