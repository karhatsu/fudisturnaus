import React from 'react'
import PropTypes from 'prop-types'
import { addDays, addMinutes, differenceInCalendarDays, format, parseISO } from 'date-fns'
import { parseFromTimeZone } from 'date-fns-timezone'
import { deletePlayoffMatch, savePlayoffMatch } from './api_client'
import AccessContext from '../util/access_context'
import { formatMatchTime, formatTime, resolveDay, resolveWeekDay } from '../util/date_util'

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
      ageGroupName: PropTypes.string.isRequired,
    })),
    playoffMatch: PropTypes.shape({
      ageGroupId: PropTypes.number.isRequired,
      awayTeamOriginId: PropTypes.number.isRequired,
      awayTeamOriginType: PropTypes.string.isRequired,
      awayTeamOriginRule: PropTypes.number.isRequired,
      field: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      homeTeamOriginId: PropTypes.number.isRequired,
      homeTeamOriginType: PropTypes.string.isRequired,
      homeTeamOriginRule: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      startTime: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
    playoffMatches: PropTypes.arrayOf(PropTypes.shape({
      field: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
      startTime: PropTypes.string.isRequired,
    })).isRequired,
    onPlayoffMatchDelete: PropTypes.func,
    onPlayoffMatchSave: PropTypes.func.isRequired,
    matchMinutes: PropTypes.number.isRequired,
    teams: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      group: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
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
    const { ageGroups, playoffMatch, tournamentDays } = this.props
    let text = '+ Lisää uusi jatko-ottelu'
    if (playoffMatch) {
      const { ageGroupId, field, startTime, title } = playoffMatch
      const time = formatMatchTime(tournamentDays, startTime)
      const ageGroupName = ageGroups.find(ageGroup => ageGroup.id === ageGroupId).name
      text = `${field.name} | ${time} | ${ageGroupName} | ${title}`
    }
    return <div className="tournament-item__title"><span onClick={this.openForm}>{text}</span></div>
  }

  renderForm() {
    const { ageGroups, fields, playoffMatch } = this.props
    const { errors, form: { startTime, title } } = this.state
    return (
      <div className="form form--horizontal">
        {errors.length > 0 && <div className="form-error">{errors.join('. ')}.</div>}
        <div className="tournament-item__form">
          {this.buildIdNameDropDown(ageGroups, 'ageGroupId', '- Ikäryhmä -')}
          {this.buildIdNameDropDown(fields, 'fieldId', '- Kenttä -', this.setField)}
          {this.buildDayDropDown()}
          <div className="form__field form__field--time">
            <input ref={this.timeFieldRed} type="text" onChange={this.changeValue('startTime')} value={startTime} placeholder="HH:MM"/>
          </div>
          <div className="form__field">
            <input type="text" onChange={this.changeValue('title')} value={title} placeholder="Kuvaus, esim. A1-B2 tai Finaali"/>
          </div>
          {this.renderSourceField('home', 'Koti')}
          {this.renderRuleField('home')}
          {this.renderSourceField('away', 'Vieras')}
          {this.renderRuleField('away')}
          <div className="form__buttons">
            <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary" disabled={!this.canSubmit()}/>
            <input type="button" value="Peruuta" onClick={this.cancel} className="button"/>
            {!!playoffMatch && <input type="button" value="Poista" onClick={this.delete} className="button button--danger"/>}
          </div>
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
          </select>
        </div>
      )
    }
  }

  renderRuleField(homeAway) {
    const origin = this.state.form[`${homeAway}TeamOrigin`]
    if (origin) {
      const field = `${homeAway}TeamOriginRule`
      const groupId = this.parseOriginId(origin)
      const teamCount = this.props.teams.filter(team => team.group.id === groupId).length
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
    }
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
        fieldId: playoffMatch ? playoffMatch.field.id : undefined,
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
      const sameFieldMatches = playoffMatches.filter(match => match.field.id === parseInt(fieldId))
      if (sameFieldMatches.length) {
        const previousMatch = sameFieldMatches[sameFieldMatches.length - 1]
        const suggestedDate = addMinutes(parseISO(previousMatch.startTime), matchMinutes)
        startTime = format(suggestedDate, 'HH:mm')
        day = differenceInCalendarDays(suggestedDate, parseISO(tournamentDate)) + 1
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