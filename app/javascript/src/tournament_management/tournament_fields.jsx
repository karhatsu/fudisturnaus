import React, { useCallback, useContext, useEffect, useState } from 'react'
import { formatDateRange } from '../util/date_util'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import { visibilityTypes } from '../util/enums'
import VisibilityBadge from './visibility_badge'
import useForm from '../util/use_form'
import ReactMarkdown from 'react-markdown'
import ClubSelect, { CHOOSE_CLUB_ID } from '../form/club_select'
import { fetchAddressSuggestions } from './api_client'
import AccessContext from '../util/access_context'

const { onlyTitle, teams, all } = visibilityTypes

const TournamentFields = (props) => {
  const { contactId, clubName, clubs, official, tournament, onCancel, onSave } = props
  const isNew = !tournament.id
  const isEditing = !isNew
  const { changeValue, formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange, onCheckboxChange } =
    useForm(isNew ? tournament : undefined)
  const [addressSuggestions, setAddressSuggestions] = useState()
  const accessContext = useContext(AccessContext)

  const onMultipleEventsChange = useCallback(
    (event) => {
      const days = event.target.checked ? 0 : 1
      changeValue('days', days)
    },
    [changeValue],
  )

  const onClubIdChange = useCallback(
    (clubId) => {
      changeValue('clubId', clubId)
    },
    [changeValue],
  )

  const getAddressSuggestions = useCallback(() => {
    if (!data.location) return
    fetchAddressSuggestions(accessContext, data.location, (err, data) => {
      if (data) setAddressSuggestions(data)
      else console.error('Failed to fetch address suggestions', err)
    })
  }, [accessContext, data.location])

  useEffect(() => {
    if (contactId) {
      getAddressSuggestions()
    }
  }, [contactId, getAddressSuggestions])

  const onAddressSuggestionSelection = useCallback(
    (event) => {
      if (event.target.value) changeValue('address', event.target.value)
    },
    [changeValue],
  )

  const renderTournamentForm = () => {
    return (
      <form className="form form--vertical">
        {renderOrganizerField()}
        {renderTournamentField('Nimi', 'text', 'name', 'Esim. Kevät Cup 2019')}
        {renderTournamentField('Pvm', 'date', 'startDate')}
        {renderMultipleEventsCheckbox()}
        {(data.days === '' || data.days > 0) && renderTournamentField('Kesto (pv)', 'number', 'days')}
        {renderLocationField()}
        {renderAddressSuggestions()}
        {renderTournamentField('Osoite', 'text', 'address', 'Esim. Tanhuantie 4-6, 00940 Helsinki')}
        {isEditing && renderTournamentField('Otteluiden välinen aika (min)', 'number', 'matchMinutes')}
        {isEditing && renderEqualPointsRuleField()}
        {isEditing && renderVisibilityField()}
        {isEditing && renderInfoField()}
        {!official && renderCheckbox('Premium', 'premium')}
        {isEditing && renderCheckbox('Peruttu', 'cancelled')}
        {!official && renderCheckbox('Testiturnaus', 'test')}
        <FormErrors errors={errors} />
        {renderTournamentFormButtons()}
      </form>
    )
  }

  const renderOrganizerField = () => {
    if (!clubs || official) return
    return (
      <div className="form__field">
        <div className="label">Järjestävä seura</div>
        <ClubSelect
          clubId={data.clubId || CHOOSE_CLUB_ID}
          clubs={clubs}
          initialSearch={clubName}
          onChange={onClubIdChange}
        />
      </div>
    )
  }

  const renderMultipleEventsCheckbox = () => {
    return (
      <div className="form__field">
        <div className="label">Monta erillistä päivää</div>
        <div>
          <input type="checkbox" onChange={onMultipleEventsChange} checked={parseInt(data.days) === 0} />
        </div>
      </div>
    )
  }

  const renderLocationField = () => {
    const onBlur = isNew ? getAddressSuggestions : undefined
    return (
      <TextField
        label="Paikka"
        onBlur={onBlur}
        onChange={onFieldChange('location')}
        placeholder="Esim. Kontulan urheilupuisto"
        type="text"
        value={data.location}
      />
    )
  }

  const renderTournamentField = (label, type, field, placeholder) => {
    return (
      <TextField
        label={label}
        onChange={onFieldChange(field)}
        placeholder={placeholder}
        type={type}
        value={data[field]}
      />
    )
  }

  const renderAddressSuggestions = () => {
    if (!addressSuggestions) return
    return (
      <div className="form__field">
        <div className="label">Valitse osoite</div>
        <div>
          <select onChange={onAddressSuggestionSelection}>
            <option value="">- Valitse osoite -</option>
            {addressSuggestions.map((suggestion) => (
              <option key={suggestion.id} value={suggestion.address}>
                {suggestion.location} = {suggestion.address}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  const renderEqualPointsRuleField = () => {
    return (
      <div className="form__field">
        <div className="label">Sääntö tasapisteissä</div>
        <div className="">
          <select onChange={onFieldChange('equalPointsRule')} value={data.equalPointsRule}>
            <option value={0}>Kaikki ottelut (pisteet, maaliero, tehdyt maalit), keskinäiset ottelut, arpa</option>
            <option value={1}>Keskinäiset ottelut (pisteet, maaliero, tehdyt maalit), kaikki ottelut, arpa</option>
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

  const renderInfoField = () => (
    <div className="form__field">
      <div className="label">Turnausinfo</div>
      <div className="form__field__tournament-info">
        <textarea onChange={onFieldChange('info')} value={data.info || ''} />
        {data.info && (
          <div className="info-box info-box--tournament-info">
            <ReactMarkdown>{data.info}</ReactMarkdown>
          </div>
        )}
      </div>
      <div className="form__field__help">
        Voit käyttää{' '}
        <a href="https://commonmark.org/help/" target="_blank" rel="noreferrer">
          markdown-muotoilua
        </a>{' '}
        esim. linkkien tekemiseen
      </div>
    </div>
  )

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
        <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()} />
        <Button label="Peruuta" onClick={cancel} type="normal" />
      </div>
    )
  }

  const renderTournamentReadOnlyFields = () => {
    const { name, startDate, days, location, address, visibility } = tournament
    const showBadge = visibility !== visibilityTypes.all
    const texts = [name, formatDateRange(startDate, days), location, address || '(ei osoitetta)']
    return (
      <div className="tournament-item">
        <div className="tournament-item__title tournament-item__title--existing">
          <span onClick={onOpenClick} className={showBadge ? 'tournament-item__title--with-badge' : ''}>
            <span>{texts.join(', ')}</span>
            {showBadge && <VisibilityBadge visibility={visibility} />}
          </span>
        </div>
      </div>
    )
  }

  const onOpenClick = () => {
    const {
      name,
      startDate,
      days,
      location,
      address,
      matchMinutes,
      equalPointsRule,
      visibility,
      clubId,
      cancelled,
      info,
      test,
    } = tournament
    openForm({
      name,
      startDate,
      days,
      location,
      address: address || '',
      matchMinutes,
      equalPointsRule,
      visibility,
      clubId,
      cancelled,
      info,
      test,
    })
  }

  const cancel = () => {
    onCancel ? onCancel() : closeForm()
  }

  const canSubmit = () => {
    const { days, name, startDate, location } = data
    return parseInt(days) >= 0 && !!name && !!startDate && !!location
  }

  const submit = () => {
    const trimmedData = { ...data }
    trimmedData.name = trimmedData.name.trim()
    trimmedData.location = trimmedData.location.trim()
    trimmedData.address = trimmedData.address.trim()
    onSave(trimmedData, (errors) => {
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

export default TournamentFields
