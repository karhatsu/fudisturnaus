import React, { useContext, useEffect, useRef } from 'react'
import AccessContext from '../util/access_context'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import { createClub, deleteClub, updateClub } from './api_client'
import Team from '../public/team'
import useForm from '../util/use_form'
import { resolveTournamentItemClasses } from '../util/util'

const ClubForm = ({ club, onClubDelete, onClubSave }) => {
  const { data, errors, formOpen, openForm, closeForm, onFieldChange, setErrors } = useForm()
  const nameField = useRef(undefined)
  const accessContext = useContext(AccessContext)

  useEffect(() => {
    if (formOpen) {
      nameField.current.focus()
    }
  }, [formOpen])

  const renderName = () => {
    return (
      <div className={resolveTournamentItemClasses(!!club)} onClick={onOpenClick}>
        {club && <Team club={club} name={club.name} showAlias={true} />}
        {!club && <span>+ Lisää uusi seura</span>}
      </div>
    )
  }

  const renderForm = () => {
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors}/>
        <div className="tournament-item__form">
          <TextField placeholder="Name" ref={nameField} onChange={onFieldChange('name')} value={data.name}/>
          <TextField placeholder="Logo URL" onChange={onFieldChange('logoUrl')} value={data.logoUrl}/>
          <TextField placeholder="Alias" onChange={onFieldChange('alias')} value={data.alias}/>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
            <Button label="Peruuta" onClick={closeForm} type="normal"/>
            {onClubDelete && <Button label="Poista" onClick={handleDelete} type="danger"/>}
          </div>
        </div>
      </form>
    )
  }

  const onOpenClick = () => {
    const { alias, logoUrl, name } = (club || {})
    openForm({ logoUrl: logoUrl || '', name: name || '', alias: alias || ''  })
  }

  const canSubmit = () => {
    return !!data.name
  }

  const submit = () => {
    const { name, logoUrl, alias } = data
    if (club) {
      updateClub(accessContext, club.id, { name, logoUrl, alias }, (errors, data) => {
        if (errors) {
          setErrors(errors)
        } else {
          closeForm()
          onClubSave(data)
        }
      })
    } else {
      createClub(accessContext, { name, logoUrl, alias }, (errors, data) => {
        if (errors) {
          setErrors(errors)
        } else {
          closeForm()
          onClubSave(data)
        }
      })
    }
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

export default ClubForm
