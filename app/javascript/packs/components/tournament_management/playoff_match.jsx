import React from 'react'
import PropTypes from 'prop-types'
import { addDays, parseISO } from 'date-fns'
import { parseFromTimeZone } from 'date-fns-timezone'
import { deletePlayoffMatch, savePlayoffMatch } from './api_client'
import AccessContext from '../util/access_context'
import { formatMatchTime, formatTime, resolveDay, resolveWeekDay } from '../util/date_util'
import { resolveTournamentItemClasses, resolveSuggestedTime, getName } from '../util/util'

const ORIGIN_SEPARATOR = '@'

export default class PlayoffMatch extends React.PureComponent {
  static propTypes = {
    ageGroups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    fields: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    groups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      ageGroupId: PropTypes.number.isRequired,
    })),
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
      startTime: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
    playoffMatches: PropTypes.arrayOf(PropTypes.shape({
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
    const { ageGroups, fields, playoffMatch, tournamentDays } = this.props
    let text = '+ Lisää uusi jatko-ottelu'
    if (playoffMatch) {
      const { ageGroupId, fieldId, startTime, title } = playoffMatch
      const time = formatMatchTime(tournamentDays, startTime)
      const fieldName = getName(fields, fieldId)
      text = `${fieldName} | ${time} | ${getName(ageGroups, ageGroupId)} | ${title}`
    }
    return <div className={resolveTournamentItemClasses(playoffMatch)}><span onClick={this.openForm}>{text}</span></div>
  }

  renderForm() {
    const { ageGroups, fields } = this.props
    const { errors } = this.state
    return (
      <div className="form form--horizontal">
        {errors.length > 0 && <div className="form-error">{errors.join('. ')}.</div>}
        <div className="tournament-item__form">
          {this.buildIdNameDropDown(ageGroups.filter(ageGroup => ageGroup.calculateGroupTables), 'ageGroupId', '- Sarja -')}
          {this.buildIdNameDropDown(fields, 'fieldId', '- Kenttä -', this.setField)}
          {this.buildDayDropDown()}
          {this.renderStartTimeField()}
          {this.renderTitleField()}
          {this.renderSourceField('home', 'Koti')}
          {this.renderRuleField('home')}
          {this.renderSourceField('away', 'Vieras')}
          {this.renderRuleField('away')}
          {this.renderButtons()}
        </div>
      </div>
    )
  }

  buildIdNameDropDown(items, field, label, customOnChange, customNameBuild) {
    const nameBuild = customNameBuild || (item => item.name)
    const onChange = customOnChange || this.changeValue(field)
    return (
      <div className="form__field">
        <select onChange={onChange} value={this.state.form[field]}>
          <option>{label}</option>
          {items.map(item => {
            const { id } = item
            return <option key={id} value={id}>{nameBuild(item)}</option>
          })}
        </select>
      </div>
    )
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

  renderTitleField() {
    const { form: { title } } = this.state
    return (
      <div className="form__field">
        <input type="text" onChange={this.changeValue('title')} value={title} placeholder="Kuvaus, esim. A1-B2 tai Finaali"/>
      </div>
    )
  }

  renderSourceField(homeAway, label) {
    const { form: { ageGroupId } } = this.state
    if (ageGroupId) {
      const groups = this.props.groups.filter(group => group.ageGroupId === parseInt(ageGroupId))
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
              {this.props.playoffMatches.map(playoffMatch => {
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
              <option value={-2}>Voittaja</option>
              <option value={-1}>Häviäjä</option>
            </select>
          </div>
        )
      }
    }
  }

  renderButtons() {
    return (
      <div className="form__buttons">
        <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary" disabled={!this.canSubmit()}/>
        <input type="button" value="Peruuta" onClick={this.cancel} className="button"/>
        {!!this.props.playoffMatch && <input type="button" value="Poista" onClick={this.delete} className="button button--danger"/>}
      </div>
    )
  }

  openForm = () => {
    const { playoffMatch, tournamentDate } = this.props
    this.setState({
      formOpen: true,
      form: {
        ageGroupId: playoffMatch ? playoffMatch.ageGroupId : undefined,
        awayTeamOrigin: playoffMatch ? this.buildOrigin(playoffMatch.awayTeamOriginType, playoffMatch.awayTeamOriginId) : undefined,
        awayTeamOriginRule: playoffMatch ? playoffMatch.awayTeamOriginRule : undefined,
        day: playoffMatch ? resolveDay(tournamentDate, playoffMatch.startTime) : 1,
        fieldId: playoffMatch ? playoffMatch.fieldId : undefined,
        homeTeamOrigin: playoffMatch ? this.buildOrigin(playoffMatch.homeTeamOriginType, playoffMatch.homeTeamOriginId) : undefined,
        homeTeamOriginRule: playoffMatch ? playoffMatch.homeTeamOriginRule : undefined,
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
    const { ageGroupId, awayTeamOrigin, awayTeamOriginRule, fieldId, day, homeTeamOrigin, homeTeamOriginRule, startTime, title } = form
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
