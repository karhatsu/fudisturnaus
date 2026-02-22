import { useCallback, useContext, useEffect, useRef } from 'react'
import { addDays, differenceInDays, format, parseISO } from 'date-fns'
import { deleteGroupStageMatch, saveGroupStageMatch } from './api_client'
import AccessContext from '../util/access_context'
import { formatMatchTime, formatTime, parseDateAndTime, resolveDay, resolveWeekDay } from '../util/date_util'
import { getName, resolveSuggestedTime, resolveTournamentItemClasses } from '../util/util'
import IdNameSelect from '../form/id_name_select'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import useForm from '../util/use_form'

const GroupStageMatch = (props) => {
  const {
    ageGroups,
    fields,
    groups,
    groupStageMatch,
    groupStageMatches,
    matchMinutes,
    onGroupStageMatchDelete,
    onGroupStageMatchSave,
    referees,
    teams,
    tournamentDate,
    tournamentId,
    tournamentDays,
  } = props
  const accessContext = useContext(AccessContext)
  const timeField = useRef(undefined)
  const { changeValue, formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange, changeValues } = useForm()
  const timeSuggestedRef = useRef(false)

  const onDateChange = useCallback(
    (event) => {
      if (event.target.value) {
        const day = differenceInDays(parseISO(event.target.value), parseISO(tournamentDate)) + 1
        changeValue('day', day > 1 ? day : 1)
      } else {
        changeValue('day', 1)
      }
    },
    [changeValue, tournamentDate],
  )

  useEffect(() => {
    if (formOpen && !timeSuggestedRef.current && fields.length === 1 && data.startTime === '') {
      timeSuggestedRef.current = true
      let { day, startTime } = data
      const suggestion = resolveSuggestedTime(groupStageMatches, fields[0].id, matchMinutes, tournamentDate)
      if (suggestion) {
        startTime = suggestion.startTime
        day = suggestion.day
        changeValues({ day, startTime })
        if (timeField) {
          timeField.current.focus()
        }
      }
    }
  }, [formOpen, fields, data, groupStageMatches, matchMinutes, tournamentDate, changeValues])

  const renderName = () => {
    let text = '+ Lisää uusi alkulohkon ottelu'
    if (groupStageMatch) {
      const { ageGroupId, awayTeamId, fieldId, groupId, homeTeamId, startTime, refereeId } = groupStageMatch
      const textElements = []
      if (fields.length > 1) {
        textElements.push(getName(fields, fieldId))
      }
      textElements.push(formatMatchTime(tournamentDays, startTime))
      textElements.push(getName(ageGroups, ageGroupId))
      textElements.push(getName(groups, groupId))
      textElements.push(`${getName(teams, homeTeamId)} - ${getName(teams, awayTeamId)}`)
      if (refereeId) {
        textElements.push(getName(referees, refereeId))
      }
      text = textElements.join(' | ')
    }
    return (
      <div className={resolveTournamentItemClasses(groupStageMatch)}>
        <span onClick={onOpenClick}>{text}</span>
      </div>
    )
  }

  const renderForm = () => {
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors} />
        <div className="tournament-item__form">
          {buildFieldsDropDown()}
          {buildDaySelection()}
          {renderStartTimeField()}
          {buildGroupDropDown()}
          {buildTeamDropDown('homeTeamId', '- Kotijoukkue -')}
          {buildTeamDropDown('awayTeamId', '- Vierasjoukkue -')}
          {buildRefereesDropDown()}
          {renderButtons()}
        </div>
      </form>
    )
  }

  const buildFieldsDropDown = () => {
    if (fields.length > 1) {
      return <IdNameSelect field="fieldId" formData={data} items={fields} label="- Kenttä -" onChange={setField} />
    }
  }

  const buildTeamDropDown = (field, label) => {
    if (data.groupId) {
      const teams = props.teams.filter((team) => team.groupId === parseInt(data.groupId))
      return <IdNameSelect field={field} formData={data} items={teams} label={label} onChange={onFieldChange(field)} />
    }
  }

  const buildGroupDropDown = () => {
    const customNameBuild = (item) => `${getName(ageGroups, item.ageGroupId)} | ${item.name}`
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

  const buildDaySelection = () => {
    if (tournamentDays === 0) {
      const date = format(addDays(parseISO(tournamentDate), data.day - 1), 'yyyy-MM-dd')
      return <TextField onChange={onDateChange} value={date} type="date" />
    } else if (tournamentDays > 1) {
      return (
        <div className="form__field">
          <select onChange={onFieldChange('day')} value={data.day}>
            {Array(tournamentDays)
              .fill()
              .map((x, i) => {
                return (
                  <option key={i} value={i + 1}>
                    {resolveWeekDay(tournamentDate, i)}
                  </option>
                )
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
        <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()} />
        <Button label="Peruuta" onClick={resetForm} type="normal" />
        {!!groupStageMatch && <Button type="danger" label="Poista" onClick={handleDelete} />}
      </div>
    )
  }

  const buildRefereesDropDown = () => {
    if (referees.length) {
      return (
        <IdNameSelect
          field="refereeId"
          formData={data}
          items={referees}
          label="- Tuomari -"
          onChange={onFieldChange('refereeId')}
        />
      )
    }
  }

  const onOpenClick = () => {
    openForm({
      awayTeamId: groupStageMatch ? groupStageMatch.awayTeamId : undefined,
      day: groupStageMatch ? resolveDay(tournamentDate, groupStageMatch.startTime) : 1,
      fieldId: groupStageMatch ? groupStageMatch.fieldId : fields.length === 1 ? fields[0].id : undefined,
      groupId: groupStageMatch ? groupStageMatch.groupId : undefined,
      homeTeamId: groupStageMatch ? groupStageMatch.homeTeamId : undefined,
      startTime: groupStageMatch ? formatTime(groupStageMatch.startTime) : '',
      refereeId: groupStageMatch ? groupStageMatch.refereeId : undefined,
    })
    timeSuggestedRef.current = !!groupStageMatch?.id
  }

  const setField = (event) => {
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
    return (
      parseInt(awayTeamId) > 0 &&
      parseInt(fieldId) > 0 &&
      parseInt(groupId) > 0 &&
      parseInt(homeTeamId) > 0 &&
      startTime.match(/^[012]?\d:[0-5]\d$/)
    )
  }

  const resetForm = () => {
    closeForm()
    timeSuggestedRef.current = false
  }

  const submit = () => {
    const { day, startTime: startTimeStr } = data
    const startTime = addDays(parseDateAndTime(tournamentDate, startTimeStr), day - 1)
    const body = { ...data, startTime, day: undefined }
    const id = groupStageMatch ? groupStageMatch.id : undefined
    saveGroupStageMatch(accessContext, tournamentId, id, body, (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        resetForm()
        onGroupStageMatchSave(data)
      }
    })
  }

  const handleDelete = () => {
    deleteGroupStageMatch(accessContext, tournamentId, groupStageMatch.id, (errors) => {
      if (errors) {
        setErrors(errors)
      } else {
        resetForm()
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

export default GroupStageMatch
