import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { addDays } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { deletePlayoffMatch, savePlayoffMatch } from './api_client'
import AccessContext from '../util/access_context'
import { formatMatchTime, formatTime, resolveDay, resolveWeekDay } from '../util/date_util'
import { getName, resolveSuggestedTime, resolveTournamentItemClasses } from '../util/util'
import IdNameSelect from '../form/id_name_select'
import { idNamePropType } from '../util/custom_prop_types'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import useForm from '../util/use_form'

const ORIGIN_SEPARATOR = '@'

const PlayoffMatch = props => {
  const {
    ageGroups,
    fields,
    matchMinutes,
    onPlayoffMatchDelete,
    onPlayoffMatchSave,
    playoffGroups,
    playoffMatch,
    playoffMatches,
    referees,
    teams,
    tournamentDate,
    tournamentDays,
    tournamentId,
  } = props
  const accessContext = useContext(AccessContext)
  const timeField = useRef()
  const { formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange, changeValues } = useForm()
  const [timeSuggested, setTimeSuggested] = useState(false)

  useEffect(() => {
    if (formOpen && !timeSuggested && fields.length === 1 && data.startTime === '') {
      setTimeSuggested(true)
      let { day, startTime } = data
      const suggestion = resolveSuggestedTime(playoffMatches, fields[0].id, matchMinutes, tournamentDate)
      if (suggestion) {
        startTime = suggestion.startTime
        day = suggestion.day
        changeValues({ day, startTime })
        if (timeField) {
          timeField.current.focus()
        }
      }
    }
  }, [formOpen, timeSuggested, fields, data, playoffMatches, matchMinutes, tournamentDate, changeValues])

  const renderName = () => {
    let text = '+ Lisää uusi jatko-ottelu'
    if (playoffMatch) {
      const { ageGroupId, fieldId, startTime, title, playoffGroupId, refereeId } = playoffMatch
      const textElements = []
      if (fields.length > 1) {
        textElements.push(getName(fields, fieldId))
      }
      textElements.push(formatMatchTime(tournamentDays, startTime))
      textElements.push(getName(ageGroups, ageGroupId))
      textElements.push(title)
      if (playoffGroupId) {
        const playoffGroup = playoffGroups.find(g => g.id === playoffGroupId)
        textElements.push(playoffGroup.name)
      }
      if (refereeId) {
        textElements.push(getName(referees, refereeId))
      }
      text = textElements.join(' | ')
    }
    return <div className={resolveTournamentItemClasses(playoffMatch)}><span onClick={onOpenClick}>{text}</span></div>
  }

  const renderForm = () => {
    const ageGroups = props.ageGroups.filter(ageGroup => ageGroup.calculateGroupTables)
    return (
      <form className="form form--horizontal">
        <FormErrors errors={errors}/>
        <div className="tournament-item__form">
          <IdNameSelect field="ageGroupId" formData={data} items={ageGroups} label="- Sarja -" onChange={onFieldChange('ageGroupId')}/>
          {buildFieldsDropDown()}
          {buildDayDropDown()}
          {renderStartTimeField()}
          {renderTitleField()}
          {renderSourceField('home', 'Koti')}
          {renderRuleField('home')}
          {renderSourceField('away', 'Vieras')}
          {renderRuleField('away')}
          {renderPlayoffGroupsDropDown()}
          {buildRefereesDropDown()}
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

  const renderTitleField = () => {
    return <TextField onChange={onFieldChange('title')} placeholder="Kuvaus, esim. A1-B2 tai Finaali" value={data.title}/>
  }

  const renderSourceField = (homeAway, label) => {
    if (data.ageGroupId) {
      const groups = props.groups.filter(group => group.ageGroupId === parseInt(data.ageGroupId))
      const playoffMatches = props.playoffMatches.filter(match => match.ageGroupId === parseInt(data.ageGroupId))
      const field = `${homeAway}TeamOrigin`
      return (
        <div className="form__field">
          <select value={data[field]} onChange={onFieldChange(field)}>
            <option>- {label} -</option>
            <optgroup label="Lohkosta">
              {groups.map(group => {
                const key = buildOrigin('Group', group.id)
                return <option key={key} value={key}>{group.name}</option>
              })}
            </optgroup>
            <optgroup label="Jatko-ottelusta">
              {playoffMatches.map(playoffMatch => {
                const key = buildOrigin('PlayoffMatch', playoffMatch.id)
                return <option key={key} value={key}>{playoffMatch.title}</option>
              })}
            </optgroup>
          </select>
        </div>
      )
    }
  }

  const renderRuleField = (homeAway) => {
    const origin = data[`${homeAway}TeamOrigin`]
    if (origin) {
      const field = `${homeAway}TeamOriginRule`
      const originType = parseOriginType(origin)
      const originId = parseOriginId(origin)
      if (originType === 'Group') {
        const teamCount = teams.filter(team => team.groupId === originId).length
        return (
          <div className="form__field">
            <select value={data[field]} onChange={onFieldChange(field)}>
              <option>- Sija -</option>
              {Array(teamCount).fill().map((x, i) => {
                return <option key={i} value={i + 1}>{i + 1}.</option>
              })}
            </select>
          </div>
        )
      } else if (originType === 'PlayoffMatch') {
        return (
          <div className="form__field">
            <select value={data[field]} onChange={onFieldChange(field)}>
              <option>- Ottelun -</option>
              <option value={-1}>Voittaja</option>
              <option value={-2}>Häviäjä</option>
            </select>
          </div>
        )
      }
    }
  }

  const renderPlayoffGroupsDropDown = () => {
    const groups = data.ageGroupId && playoffGroups.filter(g => g.ageGroupId === parseInt(data.ageGroupId))
    if (groups && groups.length) {
      return (
        <div className="form__field">
          <select onChange={onFieldChange('playoffGroupId')} value={data.playoffGroupId || ''}>
            <option value="">- Jatkolohko -</option>
            {groups.map(playoffGroup => {
              const { id, name } = playoffGroup
              return <option key={id} value={id}>{name}</option>
            })}
          </select>
        </div>
      )
    }
  }

  const buildRefereesDropDown = () => {
    if (referees.length) {
      return <IdNameSelect field="refereeId" formData={data} items={referees} label="- Tuomari -" onChange={onFieldChange('refereeId')}/>
    }
  }

  const renderButtons = () => {
    return (
      <div className="form__buttons">
        <Button label="Tallenna" onClick={submit} type="primary" disabled={!canSubmit()}/>
        <Button label="Peruuta" onClick={resetForm} type="normal"/>
        {!!playoffMatch && <Button type="danger" label="Poista" onClick={handleDelete}/>}
      </div>
    )
  }

  const onOpenClick = () => {
    openForm({
      ageGroupId: playoffMatch ? playoffMatch.ageGroupId : undefined,
      awayTeamOrigin: playoffMatch ? buildOrigin(playoffMatch.awayTeamOriginType, playoffMatch.awayTeamOriginId) : undefined,
      awayTeamOriginRule: playoffMatch ? playoffMatch.awayTeamOriginRule : undefined,
      day: playoffMatch ? resolveDay(tournamentDate, playoffMatch.startTime) : 1,
      fieldId: playoffMatch ? playoffMatch.fieldId : fields.length === 1 ? fields[0].id : undefined,
      homeTeamOrigin: playoffMatch ? buildOrigin(playoffMatch.homeTeamOriginType, playoffMatch.homeTeamOriginId) : undefined,
      homeTeamOriginRule: playoffMatch ? playoffMatch.homeTeamOriginRule : undefined,
      playoffGroupId: playoffMatch ? playoffMatch.playoffGroupId : undefined,
      startTime: playoffMatch ? formatTime(playoffMatch.startTime) : '',
      title: playoffMatch ? playoffMatch.title : '',
      refereeId: playoffMatch ? playoffMatch.refereeId : undefined,
    })
  }

  const resetForm = () => {
    closeForm()
    setTimeSuggested(false)
  }

  const setField = event => {
    let { day, startTime } = data
    const fieldId = event.target.value
    if (fieldId && startTime === '') {
      const suggestion = resolveSuggestedTime(playoffMatches, fieldId, matchMinutes, tournamentDate)
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
    const { ageGroupId, awayTeamOrigin, awayTeamOriginRule, fieldId, homeTeamOrigin, homeTeamOriginRule, startTime, title } = data
    return parseInt(ageGroupId) > 0 && !!awayTeamOrigin && !!awayTeamOriginRule && parseInt(fieldId) > 0 && !!homeTeamOrigin &&
      !!homeTeamOriginRule && startTime.match(/\d{2}:\d{2}/) && !!title
  }

  const submit = () => {
    const {
      ageGroupId,
      awayTeamOrigin,
      awayTeamOriginRule,
      fieldId,
      day,
      homeTeamOrigin,
      homeTeamOriginRule,
      playoffGroupId,
      refereeId,
      startTime,
      title,
    } = data
    const id = playoffMatch ? playoffMatch.id : undefined
    const body = {
      ageGroupId,
      awayTeamOriginId: parseOriginId(awayTeamOrigin),
      awayTeamOriginType: parseOriginType(awayTeamOrigin),
      awayTeamOriginRule,
      fieldId,
      homeTeamOriginId: parseOriginId(homeTeamOrigin),
      homeTeamOriginType: parseOriginType(homeTeamOrigin),
      homeTeamOriginRule,
      playoffGroupId,
      refereeId,
      startTime: addDays(zonedTimeToUtc(`${tournamentDate} ${startTime}`, 'Europe/Helsinki'), day - 1),
      title,
    }
    savePlayoffMatch(accessContext, tournamentId, id, body, (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        resetForm()
        onPlayoffMatchSave(data)
      }
    })
  }

  const handleDelete = () => {
    deletePlayoffMatch(accessContext, tournamentId, playoffMatch.id, (errors) => {
      if (errors) {
        setErrors(errors)
      } else {
        resetForm()
        onPlayoffMatchDelete(playoffMatch.id)
      }
    })
  }

  const buildOrigin = (type, id) => {
    return `${type}${ORIGIN_SEPARATOR}${id}`
  }

  const parseOriginType = origin => {
    return origin.split(ORIGIN_SEPARATOR)[0]
  }

  const parseOriginId = origin => {
    return parseInt(origin.split(ORIGIN_SEPARATOR)[1])
  }

  return (
    <div className="tournament-item">
      {formOpen && renderForm()}
      {!formOpen && renderName()}
    </div>
  )
}

PlayoffMatch.propTypes = {
  ageGroups: PropTypes.arrayOf(idNamePropType).isRequired,
  fields: PropTypes.arrayOf(idNamePropType).isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    ageGroupId: PropTypes.number.isRequired,
  })),
  playoffGroups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    ageGroupId: PropTypes.number.isRequired,
  })).isRequired,
  playoffMatch: PropTypes.shape({
    ageGroupId: PropTypes.number.isRequired,
    awayTeamOriginId: PropTypes.number.isRequired,
    awayTeamOriginType: PropTypes.string.isRequired,
    awayTeamOriginRule: PropTypes.number.isRequired,
    fieldId: PropTypes.number.isRequired,
    homeTeamOriginId: PropTypes.number.isRequired,
    homeTeamOriginType: PropTypes.string.isRequired,
    homeTeamOriginRule: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    playoffGroupId: PropTypes.number,
    refereeId: PropTypes.number,
    startTime: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  playoffMatches: PropTypes.arrayOf(PropTypes.shape({
    ageGroupId: PropTypes.number.isRequired,
    fieldId: PropTypes.number.isRequired,
    startTime: PropTypes.string.isRequired,
  })).isRequired,
  onPlayoffMatchDelete: PropTypes.func,
  onPlayoffMatchSave: PropTypes.func.isRequired,
  matchMinutes: PropTypes.number.isRequired,
  referees: PropTypes.array.isRequired,
  teams: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    groupId: PropTypes.number.isRequired,
  })).isRequired,
  tournamentDays: PropTypes.number.isRequired,
  tournamentId: PropTypes.number.isRequired,
  tournamentDate: PropTypes.string.isRequired,
}

export default PlayoffMatch
