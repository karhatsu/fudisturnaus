import React from 'react'
import PropTypes from 'prop-types'
import { addDays, parseISO } from 'date-fns'
import { parseFromTimeZone } from 'date-fns-timezone'
import { deleteGroupStageMatch, saveGroupStageMatch } from './api_client'
import AccessContext from '../util/access_context'
import { formatMatchTime, formatTime, resolveDay, resolveWeekDay } from '../util/date_util'
import { resolveTournamentItemClasses, resolveSuggestedTime, getName } from '../util/util'
import IdNameSelect from '../form/IdNameSelect'
import { idNamePropType } from '../util/custom_prop_types'

export default class GroupStageMatch extends React.PureComponent {
  static propTypes = {
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

  static contextType = AccessContext

  constructor(props) {
    super(props)
    this.state = {
      formOpen: false,
      form: {
        awayTeamId: undefined,
        day: undefined,
        fieldId: undefined,
        groupId: undefined,
        homeTeamId: undefined,
        startTime: undefined,
      },
      errors: [],
    }
    this.timeFieldRed = React.createRef()
  }

  render() {
    return (
      <div className="tournament-item">
        {this.state.formOpen && this.renderForm()}
        {!this.state.formOpen && this.renderName()}
      </div>
    )
  }

  renderName() {
    const { ageGroups, fields, groups, groupStageMatch, teams, tournamentDays } = this.props
    let text = '+ Lisää uusi alkulohkon ottelu'
    if (groupStageMatch) {
      const { ageGroupId, awayTeamId, fieldId, groupId, homeTeamId, startTime } = groupStageMatch
      const time = formatMatchTime(tournamentDays, startTime)
      const fieldName = getName(fields, fieldId)
      const groupName = getName(groups, groupId)
      const ageGroupName = getName(ageGroups, ageGroupId)
      const homeTeamName = getName(teams, homeTeamId)
      const awayTeamName = getName(teams, awayTeamId)
      text = `${fieldName} | ${time} | ${groupName} (${ageGroupName}) | ${homeTeamName} - ${awayTeamName}`
    }
    return <div className={resolveTournamentItemClasses(groupStageMatch)}><span onClick={this.openForm}>{text}</span></div>
  }

  renderForm() {
    const { fields } = this.props
    const { errors, form } = this.state
    return (
      <div className="form form--horizontal">
        {errors.length > 0 && <div className="form-error">{errors.join('. ')}.</div>}
        <div className="tournament-item__form">
          <IdNameSelect field="fieldId" formData={form} items={fields} label="- Kenttä -" onChange={this.setField}/>
          {this.buildDayDropDown()}
          {this.renderStartTimeField()}
          {this.buildGroupDropDown()}
          {this.buildTeamDropDown('homeTeamId', '- Kotijoukkue -')}
          {this.buildTeamDropDown('awayTeamId', '- Vierasjoukkue -')}
          {this.renderButtons()}
        </div>
      </div>
    )
  }

  buildTeamDropDown(field, label) {
    const { form, form: { groupId } } = this.state
    if (groupId) {
      const teams = this.props.teams.filter(team => team.groupId === parseInt(groupId))
      return <IdNameSelect field={field} formData={form} items={teams} label={label} onChange={this.changeValue(field)}/>
    }
  }

  buildGroupDropDown() {
    const { form } = this.state
    const { ageGroups, groups } = this.props
    const customNameBuild = item => `${item.name} (${getName(ageGroups, item.ageGroupId)})`
    const onChange = this.changeValue('groupId')
    return <IdNameSelect customNameBuild={customNameBuild} field="groupId" formData={form} items={groups} label="- Lohko -" onChange={onChange}/>
  }

  buildDayDropDown() {
    const { tournamentDays, tournamentDate } = this.props
    if (tournamentDays > 1) {
      return (
        <div className="form__field">
          <select onChange={this.changeValue('day')} value={this.state.form.day}>
            {Array(tournamentDays).fill().map((x, i) => {
              return <option key={i} value={i + 1}>{resolveWeekDay(tournamentDate, i)}</option>
            })}
          </select>
        </div>
      )
    }
  }

  renderStartTimeField() {
    const { form: { startTime } } = this.state
    return (
      <div className="form__field form__field--time">
        <input ref={this.timeFieldRed} type="text" onChange={this.changeValue('startTime')} value={startTime} placeholder="HH:MM"/>
      </div>
    )
  }

  renderButtons() {
    return (
      <div className="form__buttons">
        <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary" disabled={!this.canSubmit()}/>
        <input type="button" value="Peruuta" onClick={this.cancel} className="button"/>
        {!!this.props.groupStageMatch && <input type="button" value="Poista" onClick={this.delete} className="button button--danger"/>}
      </div>
    )
  }

  openForm = () => {
    const { groupStageMatch, tournamentDate } = this.props
    this.setState({
      formOpen: true,
      form: {
        awayTeamId: groupStageMatch ? groupStageMatch.awayTeamId : undefined,
        day: groupStageMatch ? resolveDay(tournamentDate, groupStageMatch.startTime) : 1,
        fieldId: groupStageMatch ? groupStageMatch.fieldId : undefined,
        groupId: groupStageMatch ? groupStageMatch.groupId : undefined,
        homeTeamId: groupStageMatch ? groupStageMatch.homeTeamId : undefined,
        startTime: groupStageMatch ? formatTime(groupStageMatch.startTime) : '',
      },
    })
  }

  setField = event => {
    const { groupStageMatches, matchMinutes, tournamentDate } = this.props
    const { form } = this.state
    let { form: { day, startTime } } = this.state
    const fieldId = event.target.value
    if (fieldId && startTime === '') {
      const suggestion = resolveSuggestedTime(groupStageMatches, fieldId, matchMinutes, tournamentDate)
      if (suggestion) {
        startTime = suggestion.startTime
        day = suggestion.day
      }
    }
    this.setState({ form: { ...form, day, fieldId, startTime } })
    if (this.timeFieldRed) {
      this.timeFieldRed.current.focus()
    }
  }

  changeValue = field => event => {
    const { form } = this.state
    this.setState({ form: { ...form, [field]: event.target.value } })
  }

  canSubmit = () => {
    const { form: { awayTeamId, fieldId, groupId, homeTeamId, startTime } } = this.state
    return parseInt(awayTeamId) > 0 && parseInt(fieldId) > 0 && parseInt(groupId) > 0 && parseInt(homeTeamId) > 0 && startTime.match(/\d{2}:\d{2}/)
  }

  submit = () => {
    const { groupStageMatch, onGroupStageMatchSave, tournamentId, tournamentDate } = this.props
    const { form: { day, startTime } } = this.state
    const isoStartTime = addDays(parseFromTimeZone(parseISO(`${tournamentDate}T${startTime}`), { timeZone: 'Europe/Helsinki' }), day - 1)
    const form = { ...this.state.form, startTime: isoStartTime }
    const id = groupStageMatch ? groupStageMatch.id : undefined
    saveGroupStageMatch(this.context, tournamentId, id, form, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onGroupStageMatchSave(data)
      }
    })
  }

  cancel = () => {
    this.setState({ formOpen: false, errors: [] })
  }

  delete = () => {
    const { groupStageMatch: { id }, onGroupStageMatchDelete, tournamentId } = this.props
    deleteGroupStageMatch(this.context, tournamentId, id, (errors) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onGroupStageMatchDelete(id)
      }
    })
  }
}
