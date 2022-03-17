import React, { useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { deleteField, saveField } from './api_client'
import AccessContext from '../util/access_context'
import { resolveTournamentItemClasses } from '../util/util'
import { idNamePropType } from '../util/custom_prop_types'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import useForm from '../util/use_form'

const Field = ({ field, onFieldDelete, onFieldSave, tournamentId }) =>{
  const accessContext = useContext(AccessContext)
  const nameField = useRef()
  const { formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange } = useForm()

  useEffect(() => {
    if (formOpen) {
      nameField.current.focus()
    }
  }, [formOpen])

  const renderName = () => {
    const text = field ? field.name : '+ Lisää uusi kenttä'
    return <div className={resolveTournamentItemClasses(field)}><span onClick={onOpenClick}>{text}</span></div>
  }

  const renderForm = () => {
    const placeholder = 'Esim. Kenttä 1 tai Tekonurmi 2'
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors}/>
        <div className="tournament-item__form">
          <TextField ref={nameField} onChange={onFieldChange('name')} placeholder={placeholder} value={data.name}/>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
            <Button label="Peruuta" onClick={closeForm} type="normal"/>
            {!!field && <Button type="danger" label="Poista" onClick={handleDelete}/>}
          </div>
        </div>
      </form>
    )
  }

  const onOpenClick = () => {
    openForm({ name: field ? field.name : '' })
  }

  const canSubmit = () => {
    return !!data.name
  }

  const submit = () => {
    saveField(accessContext, tournamentId, field ? field.id : undefined, data.name.trim(), (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onFieldSave(data)
      }
    })
  }

  const handleDelete = () => {
    deleteField(accessContext, tournamentId, field.id, (errors) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onFieldDelete(field.id)
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

Field.propTypes = {
  field: idNamePropType,
  onFieldDelete: PropTypes.func,
  onFieldSave: PropTypes.func.isRequired,
  tournamentId: PropTypes.number.isRequired,
}

export default Field
