import React, { useContext, useRef } from 'react'
import { deleteGroup, saveGroup } from './api_client'
import AccessContext from '../util/access_context'
import { getName, resolveTournamentItemClasses } from '../util/util'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import useForm from '../util/use_form'

const Group = ({ ageGroups, group, onGroupDelete, onGroupSave, tournamentId, type }) => {
  const accessContext = useContext(AccessContext)
  const nameField = useRef(undefined)
  const { formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange, changeValue } = useForm()

  const renderName = () => {
    const title = type === 'playoffGroup' ? 'jatkolohko' : 'lohko'
    const text = group ? `${getName(ageGroups, group.ageGroupId)} | ${group.name}` : `+ Lisää uusi ${title}`
    return <div className={resolveTournamentItemClasses(group)}><span onClick={onOpenClick}>{text}</span></div>
  }

  const renderForm = () => {
    const { ageGroupId, name } = data
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors}/>
        <div className="tournament-item__form">
          <div className="form__field">
            <select onChange={onAgeGroupChange} value={ageGroupId}>
              <option>Sarja</option>
              {ageGroups.map(ageGroup => {
                const { id, name } = ageGroup
                return <option key={id} value={id}>{name}</option>
              })}
            </select>
          </div>
          <TextField ref={nameField} onChange={onFieldChange('name')} placeholder="Esim. A tai Taso 2" value={name}/>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
            <Button label="Peruuta" onClick={closeForm} type="normal"/>
            {!!group && <Button type="danger" label="Poista" onClick={handleDelete}/>}
          </div>
        </div>
      </form>
    )
  }

  const onOpenClick = () => {
    openForm({
      ageGroupId: group ? group.ageGroupId : -1,
      name: group ? group.name : '',
    })
  }

  const onAgeGroupChange = event => {
    changeValue('ageGroupId', event.target.value)
    if (nameField) {
      nameField.current.focus()
    }
  }

  const canSubmit = () => {
    return parseInt(data.ageGroupId) > 0 && !!data.name
  }

  const submit = () => {
    const trimmedData = { ...data, name: data.name.trim() }
    saveGroup(accessContext, pathType(), tournamentId, group ? group.id : undefined, trimmedData, (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onGroupSave(data)
      }
    })
  }

  const handleDelete = () => {
    deleteGroup(accessContext, pathType(), tournamentId, group.id, (errors) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onGroupDelete(group.id)
      }
    })
  }

  const pathType = () => {
    return type === 'playoffGroup' ? 'playoff_groups' : 'groups'
  }

  return (
    <div className="tournament-item">
      {formOpen && renderForm()}
      {!formOpen && renderName()}
    </div>
  )
}

export default Group
