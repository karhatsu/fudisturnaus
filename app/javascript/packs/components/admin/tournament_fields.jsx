import React from 'react'
import PropTypes from 'prop-types'
import { formatTournamentDates } from '../util/util'
import { saveTournament } from './api-client'
import AdminSessionKeyContext from './session_key_context'

export default class TournamentFields extends React.PureComponent {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    tournament: PropTypes.shape({
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      address: PropTypes.string,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      days: PropTypes.number.isRequired,
    }).isRequired,
  }

  static contextType = AdminSessionKeyContext

  constructor(props) {
    super(props)
    this.state = {
      errors: false,
      formOpen: false,
      form: {
        name: undefined,
        startDate: undefined,
        days: undefined,
        location: undefined,
        address: undefined,
      },
    }
  }

  render() {
    const { formOpen } = this.state
    if (formOpen) {
      return this.renderTournamentForm()
    } else {
      return this.renderTournamentReadOnlyFields()
    }
  }

  renderTournamentForm() {
    return (
      <div className="form form--vertical">
        {this.state.errors.length > 0 && <div className="form-error">{this.state.errors.join('. ')}.</div>}
        {this.renderTournamentField('Nimi', 'text', 'name', 'Esim. Kevät Cup 2019')}
        {this.renderTournamentField('Pvm', 'date', 'startDate')}
        {this.renderTournamentField('Kesto (pv)', 'number', 'days')}
        {this.renderTournamentField('Paikka', 'text', 'location', 'Esim. Kontulan tekonurmi')}
        {this.renderTournamentField('Osoite', 'text', 'address', 'Esim. Tanhuantie 4-6, 00940 Helsinki')}
        {this.renderTournamentFormButtons()}
      </div>
    )
  }

  renderTournamentField(label, type, field, placeholder) {
    return (
      <div className="form__field">
        <div className="label">{label}</div>
        <div className="">
          <input type={type} value={this.state.form[field]} placeholder={placeholder} onChange={this.setValue(field)}/>
        </div>
      </div>
    )
  }

  renderTournamentFormButtons() {
    return (
      <div className="form__buttons">
        <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary" disabled={!this.canSubmit()}/>
        <input type="submit" value="Peruuta" onClick={this.closeForm} className="button"/>
      </div>
    )
  }

  renderTournamentReadOnlyFields() {
    const { tournament: { name, startDate, endDate, location, address } } = this.props
    return (
      <div className="admin-item">
        <div className="admin-item__title">
          <span onClick={this.openForm}>{name}, {formatTournamentDates(startDate, endDate)}, {location}, {address || '(ei osoitetta)'}</span>
        </div>
      </div>
    )
  }

  openForm = () => {
    const { tournament: { name, startDate, days, location, address } } = this.props
    this.setState({
      formOpen: true,
      form: { name, startDate, days, location, address: address || '' },
    })
  }

  closeForm = () => {
    this.setState({ formOpen: false, errors: [] })
  }

  setValue = field => event => {
    const { form } = this.state
    this.setState({ form: { ...form, [field]: event.target.value } })
  }

  canSubmit = () => {
    const { form: { days, name, startDate, location } } = this.state
    return parseInt(days) >= 1 && !!name && !!startDate && !!location
  }

  submit = () => {
    const { onSave, tournament: { id } } = this.props
    saveTournament(this.context, id, this.state.form, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onSave(data)
      }
    })
  }
}
