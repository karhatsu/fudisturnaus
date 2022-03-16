import React, { useContext, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { deleteGroup, saveGroup } from './api_client'
import AccessContext from '../util/access_context'
import { getName, resolveTournamentItemClasses } from '../util/util'
import { idNamePropType } from '../util/custom_prop_types'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'

const Group = ({ ageGroups, group, onGroupDelete, onGroupSave, tournamentId, type }) => {
  const accessContext = useContext(AccessContext)
  const nameField = useRef()
  const [formOpen, setFormOpen] = useState(false)
  const [data, setData] = useState({})
  const [errors, setErrors] = useState([])

  const renderName = () => {
    const title = type === 'playoffGroup' ? 'jatkolohko' : 'lohko'
    const text = group ? `${group.name} (${getName(ageGroups, group.ageGroupId)})` : `+ Lisää uusi ${title}`
    return <div className={resolveTournamentItemClasses(group)}><span onClick={editGroup}>{text}</span></div>
  }

  const renderForm = () => {
    const { ageGroupId, name } = data
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors}/>
        <div className="tournament-item__form">
          <div className="form__field">
            <select onChange={changeValue('ageGroupId')} value={ageGroupId}>
              <option>Sarja</option>
              {ageGroups.map(ageGroup => {
                const { id, name } = ageGroup
                return <option key={id} value={id}>{name}</option>
              })}
            </select>
          </div>
          <TextField ref={nameField} onChange={changeValue('name')} placeholder="Esim. A tai Taso 2" value={name}/>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
            <Button label="Peruuta" onClick={cancel} type="normal"/>
            {!!group && <Button type="danger" label="Poista" onClick={handleDelete}/>}
          </div>
        </div>
      </form>
    )
  }

  const editGroup = () => {
    setData({
      ageGroupId: group ? group.ageGroupId : -1,
      name: group ? group.name : '',
    })
    setFormOpen(true)
  }

  const changeValue = field => event => {
    setData({ ...data, [field]: event.target.value })
    if (field === 'ageGroupId' && nameField) {
      nameField.current.focus()
    }
  }

  const canSubmit = () => {
    return parseInt(data.ageGroupId) > 0 && !!data.name
  }

  const resetForm = () => {
    setFormOpen(false)
    setErrors([])
  }

  const submit = () => {
    const trimmedData = { ...data, name: data.name.trim() }
    saveGroup(accessContext, pathType(), tournamentId, group ? group.id : undefined, trimmedData, (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        resetForm()
        onGroupSave(data)
      }
    })
  }

  const cancel = () => {
    resetForm()
  }

  const handleDelete = () => {
    deleteGroup(accessContext, pathType(), tournamentId, group.id, (errors) => {
      if (errors) {
        setErrors(errors)
      } else {
        resetForm()
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

Group.propTypes = {
  ageGroups: PropTypes.arrayOf(idNamePropType).isRequired,
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    ageGroupId: PropTypes.number.isRequired,
  }),
  onGroupDelete: PropTypes.func,
  onGroupSave: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['group', 'playoffGroup']).isRequired,
  tournamentId: PropTypes.number.isRequired,
}

export default Group
