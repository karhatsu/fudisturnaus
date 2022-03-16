import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import AccessContext from '../util/access_context'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import { deleteClub, updateClub } from './api_client'
import Team from '../public/team'

const ClubForm = ({ club, onClubDelete, onClubSave }) => {
  const [formOpen, setFormOpen] = useState(false)
  const [data, setData] = useState({})
  const [errors, setErrors] = useState([])
  const nameField = useRef()
  const accessContext = useContext(AccessContext)

  useEffect(() => {
    if (formOpen) {
      nameField.current.focus()
    }
  }, [formOpen])

  const renderName = () => {
    return <div className="tournament-item__title" onClick={openForm}><Team club={club} name={club.name}/></div>
  }

  const renderForm = () => {
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors}/>
        <div className="tournament-item__form">
          <TextField ref={nameField} onChange={changeValue('name')} value={data.name}/>
          <TextField placeholder="Logo URL" onChange={changeValue('logoUrl')} value={data.logoUrl}/>
          <TextField placeholder="Alias" onChange={changeValue('alias')} value={data.alias}/>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
            <Button label="Peruuta" onClick={cancel} type="normal"/>
            <Button label="Poista" onClick={handleDelete} type="danger"/>
          </div>
        </div>
      </form>
    )
  }

  const openForm = () => {
    const { alias, logoUrl, name } = club
    setData({ logoUrl: logoUrl || '', name, alias: alias || ''  })
    setFormOpen(true)
  }

  const changeValue = field => event => setData({ ...data, [field]: event.target.value })

  const canSubmit = () => {
    return !!data.name
  }

  const submit = () => {
    const { name, logoUrl, alias } = data
    updateClub(accessContext, club.id, { name, logoUrl, alias }, (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        setFormOpen(false)
        setErrors([])
        onClubSave(data)
      }
    })
  }

  const cancel = () => {
    setFormOpen(false)
    setErrors([])
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
