import React from 'react'
import PropTypes from 'prop-types'
import { formatTournamentDates } from '../util/date_util'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import { visibilityTypes } from '../util/enums'
import VisibilityBadge from './visibility_badge'
import useForm from '../util/use_form'

const { onlyTitle, teams, all } = visibilityTypes

const initialData = {
  cancelled: false,
  clubId: undefined,
  name: '',
  startDate: '',
  days: 1,
  location: '',
  address: '',
  matchMinutes: 45,
  equalPointsRule: 0,
  visibility: teams,
}

const TournamentFields = props => {
  const { clubs, tournament, onCancel, onSave } = props
  const { formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange, onCheckboxChange } = useForm(tournament ? undefined : initialData)

  const renderTournamentForm = () => {
    return (
      <form className="form form--vertical">
        {renderOrganizerField()}
        {renderTournamentField('Nimi', 'text', 'name', 'Esim. Kevät Cup 2019')}
        {renderTournamentField('Pvm', 'date', 'startDate')}
        {renderTournamentField('Kesto (pv)', 'number', 'days')}
        {renderTournamentField('Paikka', 'text', 'location', 'Esim. Kontulan tekonurmi')}
        {renderTournamentField('Osoite', 'text', 'address', 'Esim. Tanhuantie 4-6, 00940 Helsinki')}
        {renderTournamentField('Otteluiden välinen aika (min)', 'number', 'matchMinutes')}
        {renderEqualPointsRuleField()}
        {renderVisibilityField()}
        {tournament && renderCheckbox('Peruttu', 'cancelled')}
        {!tournament && renderCheckbox('Testiturnaus', 'test')}
        <FormErrors errors={errors}/>
        {renderTournamentFormButtons()}
      </form>
    )
  }

  const renderOrganizerField = () => {
    if (!clubs) return
    return (
      <div className="form__field">
        <div className="label">Järjestävä seura</div>
        <div>
          <select onChange={onFieldChange('clubId')} value={data.clubId}>
            <option>- Ei tiedossa -</option>
            {clubs.filter(club => club.name.indexOf('Tuntematon') === -1).map(club => {
              return <option key={club.id} value={club.id}>{club.name}</option>
            })}
          </select>
        </div>
      </div>
    )
  }

  const renderTournamentField = (label, type, field, placeholder) => {
    return <TextField label={label} onChange={onFieldChange(field)} placeholder={placeholder} type={type} value={data[field]}/>
  }

  const renderEqualPointsRuleField = () => {
    return (
      <div className="form__field">
        <div className="label">Sääntö tasapisteissä</div>
        <div className="">
          <select onChange={onFieldChange('equalPointsRule')} value={data.equalPointsRule}>
            <option value={0}>Kaikki ottelut (maaliero, tehdyt maalit), keskinäiset ottelut, arpa</option>
            <option value={1}>Keskinäiset ottelut, kaikki ottelut (maaliero, tehdyt maalit), arpa</option>
          </select>
        </div>
      </div>
    )
  }

  const renderVisibilityField = () => {
    return (
      <div className="form__field">
        <div className="label">Turnauksen näkyvyys</div>
        <div className="">
          <select onChange={onFieldChange('visibility')} value={data.visibility}>
            <option value={onlyTitle}>Turnauksen perustiedot</option>
            <option value={teams}>Turnauksen perustiedot, sarjat ja joukkueet</option>
            <option value={all}>Turnauksen koko otteluohjelma</option>
          </select>
        </div>
      </div>
    )
  }

  const renderCheckbox = (label, field) => {
    return (
      <div className="form__field">
        <div className="label">{label}</div>
        <div>
          <input type="checkbox" onChange={onCheckboxChange(field)} checked={data[field]} />
        </div>
      </div>
    )
  }

  const renderTournamentFormButtons = () => {
    return (
      <div className="form__buttons">
        <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
        <Button label="Peruuta" onClick={cancel} type="normal"/>
      </div>
    )
  }

  const renderTournamentReadOnlyFields = () => {
    const { name, startDate, endDate, location, address, visibility } = tournament
    const showBadge = visibility !== visibilityTypes.all
    const texts = [name, formatTournamentDates(startDate, endDate), location, address || '(ei osoitetta)']
    return (
      <div className="tournament-item">
        <div className="tournament-item__title tournament-item__title--existing" >
          <span onClick={onOpenClick} className={showBadge ? 'tournament-item__title--with-badge' : ''}>
            <span>{texts.join(', ')}</span>
            {showBadge && <VisibilityBadge visibility={visibility}/>}
          </span>
        </div>
      </div>
    )
  }

  const onOpenClick = () => {
    const { name, startDate, days, location, address, matchMinutes, equalPointsRule, visibility, clubId, cancelled } = tournament
    openForm({ name, startDate, days, location, address: address || '', matchMinutes, equalPointsRule, visibility, clubId, cancelled })
  }

  const cancel = () => {
    onCancel ? onCancel() : closeForm()
  }

  const canSubmit = () => {
    const { days, name, startDate, location } = data
    return parseInt(days) >= 1 && !!name && !!startDate && !!location
  }

  const submit = () => {
    const trimmedData = { ...data }
    trimmedData.name = trimmedData.name.trim()
    trimmedData.location = trimmedData.location.trim()
    trimmedData.address = trimmedData.address.trim()
    onSave(trimmedData, errors => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
      }
    })
  }

  if (formOpen) {
    return renderTournamentForm()
  } else {
    return renderTournamentReadOnlyFields()
  }
}

TournamentFields.propTypes = {
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

export default TournamentFields
