import React, { useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { addDays } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { deleteGroupStageMatch, saveGroupStageMatch } from './api_client'
import AccessContext from '../util/access_context'
import { formatMatchTime, formatTime, resolveDay, resolveWeekDay } from '../util/date_util'
import { getName, resolveSuggestedTime, resolveTournamentItemClasses } from '../util/util'
import IdNameSelect from '../form/id_name_select'
import { idNamePropType } from '../util/custom_prop_types'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import useForm from '../util/use_form'

const GroupStageMatch = props => {
  const {
    ageGroups,
    fields,
    groups,
    groupStageMatch,
    groupStageMatches,
    matchMinutes,
    onGroupStageMatchDelete,
    onGroupStageMatchSave,
    teams,
    tournamentDate,
    tournamentId,
    tournamentDays,
  } = props
  const accessContext = useContext(AccessContext)
  const timeField = useRef()
  const { formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange, changeValues } = useForm()

  const renderName = () => {
    let text = '+ Lisää uusi alkulohkon ottelu'
    if (groupStageMatch) {
      const { ageGroupId, awayTeamId, fieldId, groupId, homeTeamId, startTime } = groupStageMatch
      const textElements = []
      if (fields.length > 1) {
        textElements.push(getName(fields, fieldId))
      }
      textElements.push(formatMatchTime(tournamentDays, startTime))
      textElements.push(`${getName(groups, groupId)} (${getName(ageGroups, ageGroupId)})`)
      textElements.push(`${getName(teams, homeTeamId)} - ${getName(teams, awayTeamId)}`)
      text = textElements.join(' | ')
    }
    return <div className={resolveTournamentItemClasses(groupStageMatch)}><span onClick={onOpenClick}>{text}</span></div>
  }

  const renderForm = () => {
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors}/>
        <div className="tournament-item__form">
          {buildFieldsDropDown()}
          {buildDayDropDown()}
          {renderStartTimeField()}
          {buildGroupDropDown()}
          {buildTeamDropDown('homeTeamId', '- Kotijoukkue -')}
          {buildTeamDropDown('awayTeamId', '- Vierasjoukkue -')}
          {renderButtons()}
        </div>
      </form>
    )
  }

  const buildFieldsDropDown = () => {
    if (fields.length > 1) {
      return <IdNameSelect field="fieldId" formData={data} items={fields} label="- Kenttä -" onChange={setField}/>
    }
  }

  const buildTeamDropDown = (field, label) => {
    if (data.groupId) {
      const teams = props.teams.filter(team => team.groupId === parseInt(data.groupId))
      return <IdNameSelect field={field} formData={data} items={teams} label={label} onChange={onFieldChange(field)}/>
    }
  }

  const buildGroupDropDown = () => {
    const customNameBuild = item => `${item.name} (${getName(ageGroups, item.ageGroupId)})`
    return (
      <IdNameSelect
        customNameBuild={customNameBuild}
        field="groupId"
        formData={data}
        items={groups}
        label="- Lohko -"
        onChange={onFieldChange('groupId')}
      />
    )
  }

  const buildDayDropDown = () => {
    if (tournamentDays > 1) {
      return (
        <div className="form__field">
          <select onChange={onFieldChange('day')} value={data.day}>
            {Array(tournamentDays).fill().map((x, i) => {
              return <option key={i} value={i + 1}>{resolveWeekDay(tournamentDate, i)}</option>
            })}
          </select>
        </div>
      )
    }
  }

  const renderStartTimeField = () => {
    return (
      <TextField
        ref={timeField}
        containerClass="form__field--time"
        onChange={onFieldChange('startTime')}
        placeholder="HH:MM"
        value={data.startTime}
      />
    )
  }

  const renderButtons = () => {
    return (
      <div className="form__buttons">
        <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
        <Button label="Peruuta" onClick={closeForm} type="normal"/>
        {!!groupStageMatch && <Button type="danger" label="Poista" onClick={handleDelete}/>}
      </div>
    )
  }

  const onOpenClick = () => {
    openForm({
      awayTeamId: groupStageMatch ? groupStageMatch.awayTeamId : undefined,
      day: groupStageMatch ? resolveDay(tournamentDate, groupStageMatch.startTime) : 1,
      fieldId: groupStageMatch ? groupStageMatch.fieldId : fields.length === 1 ? fields[0].id : undefined,
      groupId: groupStageMatch ? groupStageMatch.groupId : undefined,
      homeTeamId: groupStageMatch ? groupStageMatch.homeTeamId : undefined,
      startTime: groupStageMatch ? formatTime(groupStageMatch.startTime) : '',
    })
  }

  const setField = event => {
    let { day, startTime } = data
    const fieldId = event.target.value
    if (fieldId && data.startTime === '') {
      const suggestion = resolveSuggestedTime(groupStageMatches, fieldId, matchMinutes, tournamentDate)
      if (suggestion) {
        startTime = suggestion.startTime
        day = suggestion.day
      }
    }
    changeValues({ day, fieldId, startTime })
    if (timeField) {
      timeField.current.focus()
    }
  }

  const canSubmit = () => {
    const { awayTeamId, fieldId, groupId, homeTeamId, startTime } = data
    return parseInt(awayTeamId) > 0 && parseInt(fieldId) > 0 && parseInt(groupId) > 0 && parseInt(homeTeamId) > 0 && startTime.match(/\d{2}:\d{2}/)
  }

  const submit = () => {
    const { day, startTime } = data
    const isoStartTime = addDays(zonedTimeToUtc(`${tournamentDate} ${startTime}`, 'Europe/Helsinki'), day - 1)
    const body = { ...data, startTime: isoStartTime }
    const id = groupStageMatch ? groupStageMatch.id : undefined
    saveGroupStageMatch(accessContext, tournamentId, id, body, (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onGroupStageMatchSave(data)
      }
    })
  }

  const handleDelete = () => {
    deleteGroupStageMatch(accessContext, tournamentId, groupStageMatch.id, (errors) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onGroupStageMatchDelete(groupStageMatch.id)
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

GroupStageMatch.propTypes = {
  ageGroups: PropTypes.arrayOf(idNamePropType).isRequired,
  fields: PropTypes.arrayOf(idNamePropType).isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    ageGroupId: PropTypes.number.isRequired,
  })),
  groupStageMatch: PropTypes.shape({
    ageGroupId: PropTypes.number.isRequired,
    awayTeamId: PropTypes.number.isRequired,
    fieldId: PropTypes.number.isRequired,
    groupId: PropTypes.number.isRequired,
    homeTeamId: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.string.isRequired,
  }),
  groupStageMatches: PropTypes.arrayOf(PropTypes.shape({
    fieldId: PropTypes.number.isRequired,
    startTime: PropTypes.string.isRequired,
  })).isRequired,
  onGroupStageMatchDelete: PropTypes.func,
  onGroupStageMatchSave: PropTypes.func.isRequired,
  matchMinutes: PropTypes.number.isRequired,
  teams: PropTypes.arrayOf(idNamePropType).isRequired,
  tournamentDays: PropTypes.number.isRequired,
  tournamentId: PropTypes.number.isRequired,
  tournamentDate: PropTypes.string.isRequired,
}

export default GroupStageMatch
