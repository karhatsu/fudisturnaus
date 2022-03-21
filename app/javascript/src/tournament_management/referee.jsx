import React, { useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { deleteReferee, saveReferee } from './api_client'
import AccessContext from '../util/access_context'
import { resolveTournamentItemClasses } from '../util/util'
import { idNamePropType } from '../util/custom_prop_types'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import useForm from '../util/use_form'

const Referee = ({ referee, onRefereeDelete, onRefereeSave, tournamentId }) =>{
  const accessContext = useContext(AccessContext)
  const nameField = useRef()
  const { formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange } = useForm()

  useEffect(() => {
    if (formOpen) {
      nameField.current.focus()
    }
  }, [formOpen])

  const renderName = () => {
    const text = referee ? referee.name : '+ Lisää uusi tuomari'
    return <div className={resolveTournamentItemClasses(referee)}><span onClick={onOpenClick}>{text}</span></div>
  }

  const renderForm = () => {
    const placeholder = 'Tuomarin nimi'
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors}/>
        <div className="tournament-item__form">
          <TextField ref={nameField} onChange={onFieldChange('name')} placeholder={placeholder} value={data.name}/>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
            <Button label="Peruuta" onClick={closeForm} type="normal"/>
            {!!referee && <Button type="danger" label="Poista" onClick={handleDelete}/>}
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

Referee.propTypes = {
  referee: idNamePropType,
  onRefereeDelete: PropTypes.func,
  onRefereeSave: PropTypes.func.isRequired,
  tournamentId: PropTypes.number.isRequired,
}

export default Referee
