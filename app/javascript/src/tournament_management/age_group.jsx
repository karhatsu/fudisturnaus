import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { deleteAgeGroup, saveAgeGroup } from './api_client'
import AccessContext from '../util/access_context'
import { resolveTournamentItemClasses } from '../util/util'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'

const AgeGroup = ({ ageGroup, onAgeGroupDelete, onAgeGroupSave, tournamentId }) => {
  const accessContext = useContext(AccessContext)
  const nameField = useRef()
  const [formOpen, setFormOpen] = useState(false)
  const [data, setData] = useState({})
  const [errors, setErrors] = useState([])

  useEffect(() => {
    if (formOpen) {
      nameField.current.focus()
    }
  }, [formOpen])

  const renderInstructions = () => {
    return (
      <div className="tournament-item__instructions">
        Jos ikäluokan eri tasoilla on omat jatkopelit, lisää jokaiselle tasolle oma sarja (esim. &quot;P07 haaste&quot;).
        Jos taas ikäluokalla ei ole jatkopelejä, lisää sarja ilman tasoa (esim. &quot;T12&quot;) ja
        määritä tasot omiin lohkoihin alempana.
      </div>
    )
  }

  const renderName = () => {
    const text = ageGroup ? ageGroup.name : '+ Lisää uusi sarja'
    return <div className={resolveTournamentItemClasses(ageGroup)}><span onClick={editAgeGroup}>{text}</span></div>
  }

  const renderForm = () => {
    const { calculateGroupTables, name } = data
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors}/>
        <div className="tournament-item__form">
          <TextField ref={nameField} onChange={changeName} placeholder="Esim. P11 tai T09 Haaste" value={name}/>
          <div className="form__field">
            <input type="checkbox" onChange={changeCalculateGroupTables} value={true} checked={!!calculateGroupTables}/>
            Laske sarjataulukot
          </div>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
            <Button label="Peruuta" onClick={cancel} type="normal"/>
            {!!ageGroup && <Button type="danger" label="Poista" onClick={handleDelete}/>}
          </div>
        </div>
      </form>
    )
  }

  const editAgeGroup = () => {
    setData({
      name: ageGroup ? ageGroup.name : '',
      calculateGroupTables: ageGroup && ageGroup.calculateGroupTables,
    })
    setFormOpen(true)
  }

  const changeName = event => {
    setData({ ...data, name: event.target.value })
  }

  const changeCalculateGroupTables = event => {
    setData({ ...data, calculateGroupTables: event.target.checked })
  }

  const canSubmit = () => {
    return !!data.name
  }

  const resetForm = () => {
    setFormOpen(false)
    setErrors([])
  }

  const submit = () => {
    const trimmedData = { ...data, name: data.name.trim() }
    saveAgeGroup(accessContext, tournamentId, ageGroup ? ageGroup.id : undefined, trimmedData, (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        resetForm()
        onAgeGroupSave(data)
      }
    })
  }

  const cancel = () => {
    resetForm()
  }

  const handleDelete = () => {
    deleteAgeGroup(accessContext, tournamentId, ageGroup.id, (errors) => {
      if (errors) {
        setErrors(errors)
      } else {
        resetForm()
        onAgeGroupDelete(ageGroup.id)
      }
    })
  }

  const showInstructions = formOpen && !ageGroup
  return (
    <div className="tournament-item">
      {formOpen && renderForm()}
      {showInstructions && renderInstructions()}
      {!formOpen && renderName()}
    </div>
  )
}

AgeGroup.propTypes = {
  ageGroup: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    calculateGroupTables: PropTypes.bool.isRequired,
  }),
  onAgeGroupDelete: PropTypes.func,
  onAgeGroupSave: PropTypes.func.isRequired,
  tournamentId: PropTypes.number.isRequired,
}

export default AgeGroup
