import { useContext, useEffect, useRef } from 'react'
import { deleteReferee, saveReferee } from './api_client'
import AccessContext from '../util/access_context'
import { resolveTournamentItemClasses } from '../util/util'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import useForm from '../util/use_form'
import { buildUrl } from '../util/url_util'

const Referee = ({ referee, onRefereeDelete, onRefereeSave, tournamentId }) => {
  const accessContext = useContext(AccessContext)
  const nameField = useRef(undefined)
  const { formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange } = useForm()

  useEffect(() => {
    if (formOpen) {
      nameField.current.focus()
    }
  }, [formOpen])

  const renderName = () => {
    const text = referee ? referee.name : '+ Lisää uusi tuomari'
    return (
      <div className={resolveTournamentItemClasses(referee)}>
        <span onClick={onOpenClick}>{text}</span>
        {referee && (
          <a
            className="tournament-item__title__link"
            href={buildUrl(`/referees/${referee.accessKey}`)}
            target="_blank"
            rel="noreferrer"
          >
            Avaa tuomarin sivu
          </a>
        )}
      </div>
    )
  }

  const renderForm = () => {
    const placeholder = 'Tuomarin nimi'
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors} />
        <div className="tournament-item__form">
          <TextField ref={nameField} onChange={onFieldChange('name')} placeholder={placeholder} value={data.name} />
          <div className="form__buttons">
            <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()} />
            <Button label="Peruuta" onClick={closeForm} type="normal" />
            {!!referee && <Button type="danger" label="Poista" onClick={handleDelete} />}
          </div>
        </div>
      </form>
    )
  }

  const onOpenClick = () => {
    openForm({ name: referee ? referee.name : '' })
  }

  const canSubmit = () => {
    return !!data.name
  }

  const submit = () => {
    saveReferee(accessContext, tournamentId, referee ? referee.id : undefined, data.name.trim(), (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onRefereeSave(data)
      }
    })
  }

  const handleDelete = () => {
    deleteReferee(accessContext, tournamentId, referee.id, (errors) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onRefereeDelete(referee.id)
      }
    })
  }

  return (
    <div className="tournament-item">
      {formOpen && renderForm()}
      {!formOpen && renderName()}
    </div>
  )
}

export default Referee
