import React from 'react'
import TextField from '../form/text_field'
import Button from '../form/button'
import { sendContactRequest } from './api_client'
import FormErrors from '../form/form_errors'

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
      },
    }
  }

  render() {
    if (this.state.submitted) {
      return (
        <div className="message message--success message--standalone">
          Kiitos yhteydenotosta. Palaamme asiaan pian!
        </div>
      )
    }
    return (
      <form className="form form--vertical">
        <FormErrors errors={this.state.errors}/>
        {this.renderIntro()}
        {this.renderTournamentField('Nimi', 'name', 'Oma nimesi')}
        {this.renderTournamentField('Yhteystieto', 'contactInfo', 'Esim. sähköposti tai puhelin')}
        {this.renderMessageField()}
        <div className="form__buttons">
          <Button label="Lähetä" onClick={this.submit} type="primary" disabled={!this.canSubmit()}/>
        </div>
      </form>
    )
  }

  renderIntro() {
    return (
      <div className="form__intro">
        Lähetä alla oleva lomake, niin hoidetaan asia kuntoon saman tien. Voit myös kysyä lomakkeen avulla, jos jokin
        asia mietityttää.
      </div>
    )
  }

  renderTournamentField(label, field, placeholder) {
    return <TextField
      label={label}
      onChange={this.setValue(field)}
      placeholder={placeholder}
      type="text"
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
    const { form: { name, contactInfo, message } } = this.state
    return !!name && !!contactInfo && !!message
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
