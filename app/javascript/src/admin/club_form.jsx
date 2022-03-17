import React, { useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import AccessContext from '../util/access_context'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import { deleteClub, updateClub } from './api_client'
import Team from '../public/team'
import useForm from '../util/use_form'

const ClubForm = ({ club, onClubDelete, onClubSave }) => {
  const { data, errors, formOpen, openForm, closeForm, onFieldChange, setErrors } = useForm()
  const nameField = useRef()
  const accessContext = useContext(AccessContext)

  useEffect(() => {
    if (formOpen) {
      nameField.current.focus()
    }
  }, [formOpen])

  const renderName = () => {
    return <div className="tournament-item__title" onClick={onOpenClick}><Team club={club} name={club.name}/></div>
  }

  const renderForm = () => {
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors}/>
        <div className="tournament-item__form">
          <TextField ref={nameField} onChange={onFieldChange('name')} value={data.name}/>
          <TextField placeholder="Logo URL" onChange={onFieldChange('logoUrl')} value={data.logoUrl}/>
          <TextField placeholder="Alias" onChange={onFieldChange('alias')} value={data.alias}/>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
            <Button label="Peruuta" onClick={closeForm} type="normal"/>
            <Button label="Poista" onClick={handleDelete} type="danger"/>
          </div>
        </div>
      </form>
    )
  }

  const onOpenClick = () => {
    const { alias, logoUrl, name } = club
    openForm({ logoUrl: logoUrl || '', name, alias: alias || ''  })
  }

  const canSubmit = () => {
    return !!data.name
  }

  const submit = () => {
    const { name, logoUrl, alias } = data
    updateClub(accessContext, club.id, { name, logoUrl, alias }, (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onClubSave(data)
      }
    })
  }

  const handleDelete = () => {
    deleteClub(accessContext, club.id, errors => {
      if (errors) {
        setErrors(errors)
      } else {
        onClubDelete(club.id)
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

ClubForm.propTypes = {
  club: PropTypes.shape({
    alias: PropTypes.string,
    id: PropTypes.number.isRequired,
    logoUrl: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClubDelete: PropTypes.func.isRequired,
  onClubSave: PropTypes.func.isRequired,
}

export default ClubForm
