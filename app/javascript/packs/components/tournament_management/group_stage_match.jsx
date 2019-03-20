import React from 'react'
import PropTypes from 'prop-types'
import { addMinutes, format, parseISO } from 'date-fns'
import { parseFromTimeZone } from 'date-fns-timezone'
import { deleteGroupStageMatch, saveGroupStageMatch } from './api_client'
import AccessContext from '../util/access_context'
import { formatTime } from '../util/util'

export default class GroupStageMatch extends React.PureComponent {
  static propTypes = {
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
    groupStageMatch: PropTypes.shape({
      awayTeam: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      field: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      group: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        ageGroupName: PropTypes.string.isRequired,
      }),
      homeTeam: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      id: PropTypes.number.isRequired,
      startTime: PropTypes.string.isRequired,
    }),
    groupStageMatches: PropTypes.arrayOf(PropTypes.shape({
      field: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
      startTime: PropTypes.string.isRequired,
    })).isRequired,
    onGroupStageMatchDelete: PropTypes.func,
    onGroupStageMatchSave: PropTypes.func.isRequired,
    matchMinutes: PropTypes.number.isRequired,
    teams: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
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
        fieldId: undefined,
        groupId: undefined,
        homeTeamId: undefined,
        startTime: undefined,
      },
      errors: [],
    }
  }

  render() {
    return (
      <div className="admin-item">
        {this.state.formOpen && this.renderForm()}
        {!this.state.formOpen && this.renderName()}
      </div>
    )
  }

  renderName() {
    const { groupStageMatch } = this.props
    let text = '+ Lisää uusi alkulohkon ottelu'
    if (groupStageMatch) {
      const { awayTeam, field, group, homeTeam, startTime } = groupStageMatch
      text = `${field.name} | ${formatTime(startTime)} | ${group.name} (${group.ageGroupName}) | ${homeTeam.name} - ${awayTeam.name}`
    }
    return <div className="admin-item__title"><span onClick={this.editMatch}>{text}</span></div>
  }

  renderForm() {
    const { fields, groupStageMatch } = this.props
    return (
      <div className="form form--horizontal">
        {this.state.errors.length > 0 && <div className="form-error">{this.state.errors.join('. ')}.</div>}
        <div className="admin-item__form">
          {this.buildIdNameDropDown(fields, 'fieldId', '- Kenttä -', this.setField)}
          <div className="form__field form__field--time">
            <input type="text" onChange={this.changeValue('startTime')} value={this.state.form.startTime} placeholder="HH:MM"/>
          </div>
          {this.buildGroupDropDown()}
          {this.buildTeamDropDown('homeTeamId', '- Kotijoukkue -')}
          {this.buildTeamDropDown('awayTeamId', '- Vierasjoukkue -')}
          <div className="form__buttons">
            <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary" disabled={!this.canSubmit()}/>
            <input type="button" value="Peruuta" onClick={this.cancel} className="button"/>
            {!!groupStageMatch && <input type="button" value="Poista" onClick={this.delete} className="button button--danger"/>}
          </div>
        </div>
      </div>
    )
  }

  buildTeamDropDown(field, label) {
    const { form: { groupId } } = this.state
    if (groupId) {
      const { teams } = this.props
      return this.buildIdNameDropDown(teams.filter(team => team.group.id === parseInt(groupId)), field, label)
    }
  }

  buildGroupDropDown() {
    return this.buildIdNameDropDown(this.props.groups, 'groupId', '- Lohko -', this.changeValue('groupId'), item => {
      return `${item.name} (${item.ageGroupName})`
    })
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

  editMatch = () => {
    const { groupStageMatch } = this.props
    this.setState({
      formOpen: true,
      form: {
        awayTeamId: groupStageMatch ? groupStageMatch.awayTeam.id : undefined,
        fieldId: groupStageMatch ? groupStageMatch.field.id : undefined,
        groupId: groupStageMatch ? groupStageMatch.group.id : undefined,
        homeTeamId: groupStageMatch ? groupStageMatch.homeTeam.id : undefined,
        startTime: groupStageMatch ? formatTime(groupStageMatch.startTime) : '',
      },
    })
  }

  setField = event => {
    const { groupStageMatches, matchMinutes } = this.props
    const { form } = this.state
    let { form: { startTime } } = this.state
    const fieldId = event.target.value
    if (fieldId && startTime === '') {
      const sameFieldMatches = groupStageMatches.filter(match => match.field.id === parseInt(fieldId))
      if (sameFieldMatches.length) {
        const previousMatch = sameFieldMatches[sameFieldMatches.length - 1]
        startTime = format(addMinutes(parseISO(previousMatch.startTime), matchMinutes), 'HH:mm')
      }
    }
    this.setState({ form: { ...form, fieldId, startTime } })
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
    const startTime = parseFromTimeZone(parseISO(`${tournamentDate}T${this.state.form.startTime}`), { timeZone: 'Europe/Helsinki' })
    const form = { ...this.state.form, startTime }
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
