import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { createClub, deleteTeam, saveTeam } from './api_client'
import AccessContext from '../util/access_context'
import { getName, resolveTournamentItemClasses } from '../util/util'
import { idNamePropType } from '../util/custom_prop_types'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import useForm from '../util/use_form'

const CHOOSE_CLUB_ID = '-1'
const NEW_CLUB_ID = '-2'

const Team = ({ ageGroups, clubs, groups, onClubSave, onTeamDelete, onTeamSave, team, tournamentId }) => {
  const accessContext = useContext(AccessContext)
  const nameField = useRef()
  const clubNameField = useRef()
  const { formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange, changeValue, changeValues } = useForm()
  const [clubName, setClubName] = useState('')

  useEffect(() => {
    if (data.clubId && data.clubId === NEW_CLUB_ID && clubNameField) {
      clubNameField.current.focus()
    } else if (data.clubId && data.clubId !== CHOOSE_CLUB_ID && data.clubId !== NEW_CLUB_ID && nameField) {
      nameField.current.focus()
    }
  }, [data.clubId])

  const renderName = () => {
    const text = team ? team.name : '+ Lisää uusi joukkue'
    return <div className={resolveTournamentItemClasses(team)}><span onClick={editTeam}>{text}</span></div>
  }

  const renderForm = () => {
    const { clubId, groupId, name } = data
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors}/>
        <div className="tournament-item__form">
          <div className="form__field">
            <select onChange={onFieldChange('groupId')} value={groupId}>
              <option>Lohko</option>
              {groups.map(group => {
                const { id, name, ageGroupId } = group
                return <option key={id} value={id}>{getName(ageGroups, ageGroupId)} | {name}</option>
              })}
            </select>
          </div>
          <div className="form__field">
            <select onChange={onClubIdChange} value={clubId}>
              <option value={CHOOSE_CLUB_ID}>Seura</option>
              <option value={NEW_CLUB_ID}>+ Lisää uusi seura</option>
              {clubs.map(club => {
                const { id, name } = club
                return <option key={id} value={id}>{name}</option>
              })}
            </select>
          </div>
          <TextField ref={nameField} onChange={onFieldChange('name')} placeholder="Esim. FC Kontu Valkoinen" value={name}/>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
            <Button label="Peruuta" onClick={closeForm} type="normal"/>
            {!!team && <Button type="danger" label="Poista" onClick={handleDelete}/>}
          </div>
        </div>
      </form>
    )
  }

  const renderClubForm = () => {
    return (
      <div className="form form--horizontal new-club-form">
        <div className="form__field">
          <input
            ref={clubNameField}
            type="text"
            onChange={event => setClubName(event.target.value)}
            value={clubName}
            placeholder="Seuran nimi (tarkasta oikeinkirjoitus)"
          />
        </div>
        <div className="form__buttons">
          <input type="submit" value="Lisää uusi seura" onClick={saveClub} className="button button--primary"/>
          <input type="button" value="Peruuta" onClick={closeClubForm} className="button"/>
        </div>
      </div>
    )
  }

  const editTeam = () => {
    openForm({
      clubId: team ? team.club.id : CHOOSE_CLUB_ID,
      groupId: team ? team.groupId : -1,
      name: team ? team.name : '',
    })
  }

  const onClubIdChange = event => {
    const value = event.target.value
    if (!data.name && parseInt(value) > 0) {
      const clubName = getName(clubs, parseInt(value))
      if (clubName.indexOf('Ei virallista seuraa') === -1) {
        changeValue('name', `${clubName} `)
      }
    }
    changeValue('clubId', value)
  }

  const canSubmit = () => {
    const { clubId, groupId, name } = data
    return clubId > 0 && groupId > 0 && !!name
  }

  const submit = () => {
    const trimmedData = { ...data, name: data.name.trim() }
    saveTeam(accessContext, tournamentId, team ? team.id : undefined, trimmedData, (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onTeamSave(data)
      }
    })
  }

  const handleDelete = () => {
    deleteTeam(accessContext, tournamentId, team.id, (errors) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onTeamDelete(team.id)
      }
    })
  }

  const saveClub = () => {
    createClub(accessContext, clubName.trim(), (errors, response) => {
      if (errors) {
        setErrors(errors)
      } else {
        changeValues({ clubId: response.id, name: `${clubName} ` })
        setErrors([])
        setClubName('')
        onClubSave(response)
        if (nameField) {
          nameField.current.focus()
        }
      }
    })
  }

  const closeClubForm = () => {
    changeValue('clubId', CHOOSE_CLUB_ID)
    setClubName('')
  }

  return (
    <div className="tournament-item">
      {formOpen && renderForm()}
      {!formOpen && renderName()}
      {data.clubId === NEW_CLUB_ID && renderClubForm()}
    </div>
  )
}

Team.propTypes = {
  ageGroups: PropTypes.arrayOf(idNamePropType).isRequired,
  clubs: PropTypes.arrayOf(idNamePropType).isRequired,
  groups: PropTypes.arrayOf(idNamePropType).isRequired,
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    club: idNamePropType.isRequired,
    groupId: PropTypes.number.isRequired,
  }),
  onClubSave: PropTypes.func.isRequired,
  onTeamDelete: PropTypes.func,
  onTeamSave: PropTypes.func.isRequired,
  tournamentId: PropTypes.number.isRequired,
}

export default Team
