import React from 'react'
import PropTypes from 'prop-types'
import { addDays, parseISO } from 'date-fns'
import { parseFromTimeZone } from 'date-fns-timezone'
import { deletePlayoffMatch, savePlayoffMatch } from './api_client'
import AccessContext from '../util/access_context'
import { formatMatchTime, formatTime, resolveDay, resolveWeekDay } from '../util/date_util'
import { resolveTournamentItemClasses, resolveSuggestedTime, getName } from '../util/util'
import IdNameSelect from '../form/id_name_select'
import { idNamePropType } from '../util/custom_prop_types'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'

const ORIGIN_SEPARATOR = '@'

export default class PlayoffMatch extends React.PureComponent {
  static propTypes = {
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
    teams: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      groupId: PropTypes.number.isRequired,
    })).isRequired,
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
        awayTeamOrigin: undefined,
        awayTeamOriginRule: undefined,
        day: undefined,
        fieldId: undefined,
        homeTeamOrigin: undefined,
        homeTeamOriginRule: undefined,
        playoffGroupId: undefined,
        startTime: undefined,
        title: undefined,
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
    const { ageGroups, fields, playoffGroups, playoffMatch, tournamentDays } = this.props
    let text = '+ Lisää uusi jatko-ottelu'
    if (playoffMatch) {
      const { ageGroupId, fieldId, startTime, title, playoffGroupId } = playoffMatch
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
      text = textElements.join(' | ')
    }
    return <div className={resolveTournamentItemClasses(playoffMatch)}><span onClick={this.openForm}>{text}</span></div>
  }

  renderForm() {
    const ageGroups = this.props.ageGroups.filter(ageGroup => ageGroup.calculateGroupTables)
    const { form } = this.state
    return (
      <form className="form form--horizontal">
        <FormErrors errors={this.state.errors}/>
        <div className="tournament-item__form">
          <IdNameSelect field="ageGroupId" formData={form} items={ageGroups} label="- Sarja -" onChange={this.changeValue('ageGroupId')}/>
          {this.buildFieldsDropDown()}
          {this.buildDayDropDown()}
          {this.renderStartTimeField()}
          {this.renderTitleField()}
          {this.renderSourceField('home', 'Koti')}
          {this.renderRuleField('home')}
          {this.renderSourceField('away', 'Vieras')}
          {this.renderRuleField('away')}
          {this.renderPlayoffGroupsDropDown()}
          {this.renderButtons()}
        </div>
      </form>
    )
  }

  buildFieldsDropDown() {
    const { fields } = this.props
    if (fields.length > 1) {
      return <IdNameSelect field="fieldId" formData={this.state.form} items={fields} label="- Kenttä -" onChange={this.setField}/>
    }
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
    const onChange = this.changeValue('startTime')
    return <TextField ref={this.timeFieldRed} containerClass="form__field--time" onChange={onChange} placeholder="HH:MM" value={startTime}/>
  }

  renderTitleField() {
    const { form: { title } } = this.state
    return <TextField onChange={this.changeValue('title')} placeholder="Kuvaus, esim. A1-B2 tai Finaali" value={title}/>
  }

  renderSourceField(homeAway, label) {
    const { form: { ageGroupId } } = this.state
    if (ageGroupId) {
      const groups = this.props.groups.filter(group => group.ageGroupId === parseInt(ageGroupId))
      const playoffMatches = this.props.playoffMatches.filter(match => match.ageGroupId === parseInt(ageGroupId))
      const field = `${homeAway}TeamOrigin`
      return (
        <div className="form__field">
          <select value={this.state.form[field]} onChange={this.changeValue(field)}>
            <option>- {label} -</option>
            <optgroup label="Lohkosta">
              {groups.map(group => {
                const key = this.buildOrigin('Group', group.id)
                return <option key={key} value={key}>{group.name}</option>
              })}
            </optgroup>
            <optgroup label="Jatko-ottelusta">
              {playoffMatches.map(playoffMatch => {
                const key = this.buildOrigin('PlayoffMatch', playoffMatch.id)
                return <option key={key} value={key}>{playoffMatch.title}</option>
              })}
            </optgroup>
          </select>
        </div>
      )
    }
  }

  renderRuleField(homeAway) {
    const origin = this.state.form[`${homeAway}TeamOrigin`]
    if (origin) {
      const field = `${homeAway}TeamOriginRule`
      const originType = this.parseOriginType(origin)
      const originId = this.parseOriginId(origin)
      if (originType === 'Group') {
        const teamCount = this.props.teams.filter(team => team.groupId === originId).length
        return (
          <div className="form__field">
            <select value={this.state.form[field]} onChange={this.changeValue(field)}>
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
            <select value={this.state.form[field]} onChange={this.changeValue(field)}>
              <option>- Ottelun -</option>
              <option value={-1}>Voittaja</option>
              <option value={-2}>Häviäjä</option>
            </select>
          </div>
        )
      }
    }
  }

  renderPlayoffGroupsDropDown() {
    const { playoffGroups } = this.props
    const { ageGroupId } = this.state.form
    const groups = ageGroupId && playoffGroups.filter(g => g.ageGroupId === parseInt(ageGroupId))
    if (groups?.length) {
      return (
        <div className="form__field">
          <select onChange={this.changeValue('playoffGroupId')} value={this.state.form.playoffGroupId || ''}>
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

  renderButtons() {
    return (
      <div className="form__buttons">
        <Button label="Tallenna" onClick={this.submit} type="primary" disabled={!this.canSubmit()}/>
        <Button label="Peruuta" onClick={this.cancel} type="normal"/>
        {!!this.props.playoffMatch && <Button type="danger" label="Poista" onClick={this.delete}/>}
      </div>
    )
  }

  openForm = () => {
    const { fields, playoffMatch, tournamentDate } = this.props
    this.setState({
      formOpen: true,
      form: {
        ageGroupId: playoffMatch ? playoffMatch.ageGroupId : undefined,
        awayTeamOrigin: playoffMatch ? this.buildOrigin(playoffMatch.awayTeamOriginType, playoffMatch.awayTeamOriginId) : undefined,
        awayTeamOriginRule: playoffMatch ? playoffMatch.awayTeamOriginRule : undefined,
        day: playoffMatch ? resolveDay(tournamentDate, playoffMatch.startTime) : 1,
        fieldId: playoffMatch ? playoffMatch.fieldId : fields.length === 1 ? fields[0].id : undefined,
        homeTeamOrigin: playoffMatch ? this.buildOrigin(playoffMatch.homeTeamOriginType, playoffMatch.homeTeamOriginId) : undefined,
        homeTeamOriginRule: playoffMatch ? playoffMatch.homeTeamOriginRule : undefined,
        playoffGroupId: playoffMatch ? playoffMatch.playoffGroupId : undefined,
        startTime: playoffMatch ? formatTime(playoffMatch.startTime) : '',
        title: playoffMatch ? playoffMatch.title : '',
      },
    })
  }

  setField = event => {
    const { playoffMatches, matchMinutes, tournamentDate } = this.props
    const { form } = this.state
    let { form: { day, startTime } } = this.state
    const fieldId = event.target.value
    if (fieldId && startTime === '') {
      const suggestion = resolveSuggestedTime(playoffMatches, fieldId, matchMinutes, tournamentDate)
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
    const { form: { ageGroupId, awayTeamOrigin, awayTeamOriginRule, fieldId, homeTeamOrigin, homeTeamOriginRule, startTime, title } } = this.state
    return parseInt(ageGroupId) > 0 && !!awayTeamOrigin && !!awayTeamOriginRule && parseInt(fieldId) > 0 && !!homeTeamOrigin &&
      !!homeTeamOriginRule && startTime.match(/\d{2}:\d{2}/) && !!title
  }

  submit = () => {
    const { playoffMatch, onPlayoffMatchSave, tournamentId, tournamentDate } = this.props
    const { form } = this.state
    const {
      ageGroupId,
      awayTeamOrigin,
      awayTeamOriginRule,
      fieldId,
      day,
      homeTeamOrigin,
      homeTeamOriginRule,
      playoffGroupId,
      startTime,
      title,
    } = form
    const id = playoffMatch ? playoffMatch.id : undefined
    const data = {
      ageGroupId,
      awayTeamOriginId: this.parseOriginId(awayTeamOrigin),
      awayTeamOriginType: this.parseOriginType(awayTeamOrigin),
      awayTeamOriginRule,
      fieldId,
      homeTeamOriginId: this.parseOriginId(homeTeamOrigin),
      homeTeamOriginType: this.parseOriginType(homeTeamOrigin),
      homeTeamOriginRule,
      playoffGroupId,
      startTime: addDays(parseFromTimeZone(parseISO(`${tournamentDate}T${startTime}`), { timeZone: 'Europe/Helsinki' }), day - 1),
      title,
    }
    savePlayoffMatch(this.context, tournamentId, id, data, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onPlayoffMatchSave(data)
      }
    })
  }

  cancel = () => {
    this.setState({ formOpen: false, errors: [] })
  }

  delete = () => {
    const { playoffMatch: { id }, onPlayoffMatchDelete, tournamentId } = this.props
    deletePlayoffMatch(this.context, tournamentId, id, (errors) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onPlayoffMatchDelete(id)
      }
    })
  }

  buildOrigin = (type, id) => {
    return `${type}${ORIGIN_SEPARATOR}${id}`
  }

  parseOriginType = origin => {
    return origin.split(ORIGIN_SEPARATOR)[0]
  }

  parseOriginId = origin => {
    return parseInt(origin.split(ORIGIN_SEPARATOR)[1])
  }
}
