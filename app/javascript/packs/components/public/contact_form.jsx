import React from 'react'
import TextField from '../form/text_field'
import Button from '../form/button'
import { sendContactRequest } from './api_client'
import FormErrors from '../form/form_errors'

const genericIntro = 'Lähettäkää alla oleva lomake, niin hoidetaan asia kuntoon saman tien.'
const tournamentIntro = 'Jos tiedätte jo turnauksen tarkemmat tiedot, voitte täyttää ne valmiiksi tähän.'

export default class ContactForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      errors: [],
      submitted: false,
      form: {
        name: '',
        contactInfo: '',
        message: '',
        tournamentOrganizer: '',
        tournamentName: '',
        tournamentStartDate: '',
        tournamentDays: 1,
        tournamentLocation: '',
      },
    }
  }

  render() {
    if (this.state.submitted) {
      return (
        <div className="message message--success message--no-margins">
          Kiitos yhteydenotosta. Palaamme asiaan pian!
        </div>
      )
    }
    return (
      <form className="form form--vertical">
        <FormErrors errors={this.state.errors}/>
        {this.renderIntro(genericIntro)}
        {this.renderField('Nimi', 'name', 'text', 'Oma nimesi')}
        {this.renderField('Yhteystieto', 'contactInfo', 'text', 'Esim. sähköposti tai puhelin')}
        {this.renderMessageField()}
        {this.renderIntro(tournamentIntro)}
        {this.renderField('Turnauksen järjestävä seura', 'tournamentOrganizer', 'text')}
        {this.renderField('Turnauksen nimi', 'tournamentName', 'text')}
        {this.renderField('Pvm', 'tournamentStartDate', 'date')}
        {this.renderField('Kesto (pv)', 'tournamentDays', 'number')}
        {this.renderField('Paikka (kentän nimi)', 'tournamentLocation', 'text')}
        <div className="form__buttons">
          <Button label="Lähetä" onClick={this.submit} type="primary" disabled={!this.canSubmit()}/>
        </div>
      </form>
    )
  }

  renderIntro(text) {
    return <div className="form__intro">{text}</div>
  }

  renderField(label, field, type, placeholder) {
    return <TextField
      label={label}
      onChange={this.setValue(field)}
      placeholder={placeholder}
      type={type}
      value={this.state.form[field]}/>
  }

  renderMessageField() {
    return (
      <div className="form__field">
        <div className="label">Viesti</div>
        <textarea className="form__field" onChange={this.setValue('message')} cols={40} rows={10}/>
      </div>
    )
  }

  setValue = field => event => {
    const { form } = this.state
    this.setState({ form: { ...form, [field]: event.target.value } })
  }

  canSubmit = () => {
    const { form: { name, contactInfo } } = this.state
    return !!name && !!contactInfo
  }

  submit = () => {
    sendContactRequest(this.state.form, errors => {
      if (errors) {
        return this.setState({ errors })
      }
      this.setState({ submitted: true })
    })
  }
}
