import React, { useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { matchTypes } from '../util/enums'
import { saveResult } from '../tournament_management/api_client'
import AccessContext from '../util/access_context'
import Button from '../form/button'
import { formatMatchTime } from '../util/date_util'
import Team from '../public/team'
import useForm from '../util/use_form'
import { buildGroupTitle } from '../util/util'

const EditableMatch = ({ ageGroups, clubs, fieldsCount, groups, match, selectedClubId, selectedTeamId, tournamentDays, tournamentId }) => {
  const accessContext = useContext(AccessContext)
  const homeGoalsField = useRef()
  const { formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange, onCheckboxChange } = useForm()

  useEffect(() => {
    if (formOpen) {
      homeGoalsField.current.focus()
    }
  }, [formOpen])

  const renderMatchInfo = (startTime, field, ageGroup, group) => {
    const details = []
    if (fieldsCount > 1) details.push(field.name)
    const groupsTitle = buildGroupTitle(ageGroups, groups, ageGroup, group)
    if (groupsTitle) details.push(groupsTitle)
    return (
      <div>
        <span className="match__start-time">{formatMatchTime(tournamentDays, startTime)}</span>
        {details.length > 0 && <span className="match__details">{details.join(', ')}</span>}
      </div>
    )
  }

  const renderPlayoffMatchTitle = (homeTeam, awayTeam, title) => {
    if (title) {
      const text = homeTeam || awayTeam ? `${title}:` : title
      return <div className="match__playoff-title">{text}</div>
    }
  }

  const renderTeams = (homeTeam, awayTeam) => {
    if (homeTeam || awayTeam) {
      return (
        <>
          {renderTeam(homeTeam)}
          <span className="match__teams-separator">–</span>
          {renderTeam(awayTeam)}
        </>
      )
    }
  }

  const renderTeam = team => {
    if (!team) return <span>?</span>
    const selected = team.id === selectedTeamId || team.clubId === selectedClubId
    return <Team clubId={team.clubId} clubs={clubs} name={team.name} selected={selected} />
  }

  const renderResult = () => {
    const { homeTeam, awayTeam, homeGoals, awayGoals, penalties } = match
    if (formOpen) {
      return renderForm()
    }
    if (homeGoals || homeGoals === 0) {
      return <span>{homeGoals} - {awayGoals}{penalties ? ' rp' : ''}</span>
    } else if (homeTeam && awayTeam) {
      return <span className="match__no-result">Tulos</span>
    }
  }

  const renderForm = () => {
    return (
      <form>
        <div className="match__result-fields">
          {renderGoalsField('homeGoals', 1, homeGoalsField)}
          <span className="match__goals-separator">-</span>
          {renderGoalsField('awayGoals', 2)}
        </div>
        {renderPenaltiesField()}
        <div className="match__buttons">
          <Button onClick={handleSave} label="&#x2713;" type="primary" size="small" disabled={!canSubmit()} />
          <Button onClick={closeForm} label="&#x2715;" type="normal" size="small" />
        </div>
      </form>
    )
  }

  const renderGoalsField = (name, tabIndex, ref) => {
    const goals = data[name]
    const value = goals || goals === 0 ? goals : ''
    return (
      <input
        type="number"
        value={value}
        onChange={onFieldChange(name)}
        className="match__goals-field"
        tabIndex={tabIndex}
        ref={ref}
      />
    )
  }

  const renderPenaltiesField = () => {
    if (match.type === matchTypes.playoff) {
      return (
        <div className="match__penalties">
          <input type="checkbox" value={true} checked={data.penalties} onChange={onCheckboxChange('penalties')}/> rp
        </div>
      )
    }
  }

  const renderErrors = () => {
    if (errors.length > 0) {
      return <div className="form-error">{errors.join('. ')}.</div>
    }
  }

  const onClick = () => {
    const { homeTeam, awayTeam, homeGoals, awayGoals, penalties } = match
    if (!formOpen && homeTeam && awayTeam) {
      openForm({
        homeGoals: initialValue(homeGoals),
        awayGoals: initialValue(awayGoals),
        initialHomeGoals: initialValue(homeGoals),
        initialAwayGoals: initialValue(awayGoals),
        penalties,
        initialPenalties: penalties,
      })
    }
  }

  const initialValue = value => value !== null ? value.toString() : ''

  const canSubmit = () => {
    const { homeGoals, awayGoals, penalties, initialHomeGoals, initialAwayGoals, initialPenalties } = data
    const changed = homeGoals !== initialHomeGoals || awayGoals !== initialAwayGoals || penalties !== initialPenalties
    const both = (homeGoals === '' && awayGoals === '') || (isNumber(homeGoals) && isNumber(awayGoals))
    return changed && both
  }

  const isNumber = value => parseInt(value).toString() === value

  const handleSave = () => {
    const { id, type } = match
    const { homeGoals, awayGoals, penalties } = data
    saveResult(accessContext, tournamentId, type, id, parseInt(homeGoals), parseInt(awayGoals), penalties, (errors) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
      }
    })
  }

  const { startTime, field, homeTeam, awayTeam, title, ageGroup, group } = match
  return (
    <div className="match match--editable" onClick={onClick}>
      <div className="match__row">
        {renderMatchInfo(startTime, field, ageGroup, group)}
      </div>
      <div className="match__row">
        <div className="match__teams">
          {renderPlayoffMatchTitle(homeTeam, awayTeam, title)}
          {renderTeams(homeTeam, awayTeam)}
        </div>
        <div className="match__result">{renderResult()}</div>
      </div>
      {renderErrors()}
    </div>
  )
}

EditableMatch.propTypes = {
  ageGroups: PropTypes.array.isRequired,
  clubs: PropTypes.arrayOf(PropTypes.shape({
    logoUrl: PropTypes.string,
  })).isRequired,
  fieldsCount: PropTypes.number.isRequired,
  groups: PropTypes.array.isRequired,
  match: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string,
    homeTeam: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    awayTeam: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    homeGoals: PropTypes.number,
    awayGoals: PropTypes.number,
    penalties: PropTypes.bool,
    ageGroup: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    group: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  selectedClubId: PropTypes.number,
  selectedTeamId: PropTypes.number,
  tournamentDays: PropTypes.number.isRequired,
  tournamentId: PropTypes.number.isRequired,
}

export default EditableMatch
