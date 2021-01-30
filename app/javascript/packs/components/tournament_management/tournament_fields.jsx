import React from 'react'
import PropTypes from 'prop-types'
import { formatTournamentDates } from '../util/date_util'
import AccessContext from '../util/access_context'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import { visibilityTypes } from '../util/enums'
import VisibilityBadge from './visibility_badge'

const { onlyTitle, teams, all } = visibilityTypes

export default class TournamentFields extends React.PureComponent {
  static propTypes = {
    clubs: PropTypes.array,
    onCancel: PropTypes.func,
    onSave: PropTypes.func.isRequired,
    tournament: PropTypes.shape({
      cancelled: PropTypes.bool.isRequired,
      clubId: PropTypes.number,
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      address: PropTypes.string,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      days: PropTypes.number.isRequired,
      matchMinutes: PropTypes.number.isRequired,
      equalPointsRule: PropTypes.number.isRequired,
      visibility: PropTypes.oneOf([onlyTitle, teams, all]).isRequired,
    }),
  }

  static contextType = AccessContext

  constructor(props) {
    super(props)
    this.state = {
      errors: [],
      formOpen: !props.tournament,
      form: {
        cancelled: false,
        clubId: undefined,
        name: '',
        startDate: '',
        days: 1,
        location: '',
        address: '',
        matchMinutes: 45,
        equalPointsRule: 0,
        visibility: onlyTitle,
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
      <form className="form form--vertical">
        <FormErrors errors={this.state.errors}/>
        {this.renderOrganizerField()}
        {this.renderTournamentField('Nimi', 'text', 'name', 'Esim. Kevät Cup 2019')}
        {this.renderTournamentField('Pvm', 'date', 'startDate')}
        {this.renderTournamentField('Kesto (pv)', 'number', 'days')}
        {this.renderTournamentField('Paikka', 'text', 'location', 'Esim. Kontulan tekonurmi')}
        {this.renderTournamentField('Osoite', 'text', 'address', 'Esim. Tanhuantie 4-6, 00940 Helsinki')}
        {this.renderTournamentField('Otteluiden välinen aika (min)', 'number', 'matchMinutes')}
        {this.renderEqualPointsRuleField()}
        {this.renderVisibilityField()}
        {this.props.tournament && this.renderCheckbox('Peruttu', 'cancelled')}
        {!this.props.tournament && this.renderCheckbox('Testiturnaus', 'test')}
        {this.renderTournamentFormButtons()}
      </form>
    )
  }

  renderOrganizerField() {
    if (!this.props.clubs) return
    return (
      <div className="form__field">
        <div className="label">Järjestävä seura</div>
        <div>
          <select onChange={this.setValue('clubId')} value={this.state.form.clubId}>
            <option>- Ei tiedossa -</option>
            {this.props.clubs.filter(club => club.name.indexOf('Tuntematon') === -1).map(club => {
              return <option key={club.id} value={club.id}>{club.name}</option>
            })}
          </select>
        </div>
      </div>
    )
  }

  renderTournamentField(label, type, field, placeholder) {
    return <TextField label={label} onChange={this.setValue(field)} placeholder={placeholder} type={type} value={this.state.form[field]}/>
  }

  renderEqualPointsRuleField() {
    return (
      <div className="form__field">
        <div className="label">Sääntö tasapisteissä</div>
        <div className="">
          <select onChange={this.setValue('equalPointsRule')} value={this.state.form.equalPointsRule}>
            <option value={0}>Kaikki ottelut (maaliero, tehdyt maalit), keskinäiset ottelut, arpa</option>
            <option value={1}>Keskinäiset ottelut, kaikki ottelut (maaliero, tehdyt maalit), arpa</option>
          </select>
        </div>
      </div>
    )
  }

  renderVisibilityField() {
    return (
      <div className="form__field">
        <div className="label">Turnauksen näkyvyys</div>
        <div className="">
          <select onChange={this.setValue('visibility')} value={this.state.form.visibility}>
            <option value={onlyTitle}>Turnauksen perustiedot</option>
            <option value={teams}>Turnauksen perustiedot, sarjat ja joukkueet</option>
            <option value={all}>Turnauksen koko otteluohjelma</option>
          </select>
        </div>
      </div>
    )
  }

  renderCheckbox(label, field) {
    return (
      <div className="form__field">
        <div className="label">{label}</div>
        <div>
          <input type="checkbox" onChange={this.setCheckboxValue(field)} checked={this.state.form[field]} />
        </div>
      </div>
    )
  }

  renderTournamentFormButtons() {
    return (
      <div className="form__buttons">
        <Button label="Tallenna" onClick={this.submit} type="primary" disabled={!this.canSubmit()}/>
        <Button label="Peruuta" onClick={this.cancel} type="normal"/>
      </div>
    )
  }

  renderTournamentReadOnlyFields() {
    const { tournament: { name, startDate, endDate, location, address, visibility } } = this.props
    const showBadge = visibility !== visibilityTypes.all
    const texts = [name, formatTournamentDates(startDate, endDate), location, address || '(ei osoitetta)']
    return (
      <div className="tournament-item">
        <div className="tournament-item__title tournament-item__title--existing" >
          <span onClick={this.openForm} className={showBadge ? 'tournament-item__title--with-badge' : ''}>
            <span>{texts.join(', ')}</span>
            {showBadge && <VisibilityBadge visibility={visibility}/>}
          </span>
        </div>
      </div>
    )
  }

  openForm = () => {
    const { tournament: { name, startDate, days, location, address, matchMinutes, equalPointsRule, visibility, clubId, cancelled } } = this.props
    this.setState({
      formOpen: true,
      form: { name, startDate, days, location, address: address || '', matchMinutes, equalPointsRule, visibility, clubId, cancelled },
    })
  }

  cancel = () => {
    const { onCancel } = this.props
    onCancel ? onCancel() : this.setState({ formOpen: false, errors: [] })
  }

  setValue = field => event => {
    const { form } = this.state
    this.setState({ form: { ...form, [field]: event.target.value } })
  }

  setCheckboxValue = field => event => {
    const { form } = this.state
    this.setState({ form: { ...form, [field]: event.target.checked } })
  }

  canSubmit = () => {
    const { form: { days, name, startDate, location } } = this.state
    return parseInt(days) >= 1 && !!name && !!startDate && !!location
  }

  submit = () => {
    const { form } = this.state
    form.name = form.name.trim()
    form.location = form.location.trim()
    form.address = form.address.trim()
    console.log('c', form.cancelled)
    this.props.onSave(form, errors => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
      }
    })
  }
}
