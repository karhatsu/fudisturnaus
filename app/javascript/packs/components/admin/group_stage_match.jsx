import React from 'react'
import PropTypes from 'prop-types'
import { parseISO } from 'date-fns'
import { parseFromTimeZone } from 'date-fns-timezone'
import { deleteGroupStageMatch, saveGroupStageMatch } from './api-client'
import AdminSessionKeyContext from './session_key_context'
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
    onGroupStageMatchDelete: PropTypes.func,
    onGroupStageMatchSave: PropTypes.func.isRequired,
    teams: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    tournamentId: PropTypes.number.isRequired,
    tournamentDate: PropTypes.string.isRequired,
  }

  static contextType = AdminSessionKeyContext

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
      text = `${formatTime(startTime)} | ${field.name} | ${group.name} (${group.ageGroupName}) | ${homeTeam.name} - ${awayTeam.name}`
    }
    return <div className="admin-item__title" onClick={this.editMatch}>{text}</div>
  }

  renderForm() {
    const { fields, groups, groupStageMatch, teams } = this.props
    return (
      <div className="form form--horizontal">
        {this.state.errors.length > 0 && <div className="form-error">{this.state.errors.join('. ')}.</div>}
        <div className="admin-item__form">
          {this.buildIdNameDropDown(fields, 'fieldId', '- Kenttä -')}
          <div className="form__field form__field--time">
            <input type="text" onChange={this.changeValue('startTime')} value={this.state.form.startTime} placeholder="HH:MM"/>
          </div>
          {this.buildIdNameDropDown(groups, 'groupId', '- Lohko -')}
          {this.buildIdNameDropDown(teams, 'homeTeamId', '- Kotijoukkue -')}
          {this.buildIdNameDropDown(teams, 'awayTeamId', '- Vierasjoukkue -')}
          <div className="form__buttons">
            <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary"/>
            <input type="button" value="Peruuta" onClick={this.cancel} className="button"/>
            {!!groupStageMatch && <input type="button" value="Poista" onClick={this.delete} className="button button--danger"/>}
          </div>
        </div>
      </div>
    )
  }

  buildIdNameDropDown(items, field, label) {
    return (
      <div className="form__field">
        <select onChange={this.changeValue(field)} value={this.state.form[field]}>
          <option>{label}</option>
          {items.map(item => {
            const { id, name } = item
            return <option key={id} value={id}>{name}</option>
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

  changeValue = field => event => {
    const { form } = this.state
    this.setState({ form: { ...form, [field]: event.target.value } })
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
