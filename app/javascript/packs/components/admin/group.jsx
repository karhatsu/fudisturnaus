import React from 'react'
import PropTypes from 'prop-types'
import { deleteGroup, saveGroup } from './api-client'
import AdminSessionKeyContext from './session_key_context'

export default class Group extends React.PureComponent {
  static propTypes = {
    ageGroups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    group: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    onGroupDelete: PropTypes.func,
    onGroupSave: PropTypes.func.isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  static contextType = AdminSessionKeyContext

  constructor(props) {
    super(props)
    this.state = {
      formOpen: false,
      form: {
        ageGroupId: undefined,
        name: undefined,
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
    const { ageGroups, group } = this.props
    let name = 'Lisää uusi lohko'
    if (group) {
      const ageGroup = ageGroups.find(ageGroup => ageGroup.id === group.ageGroupId)
      name = `${group.name} (${ageGroup.name})`
    }
    return <div className="admin-item__title" onClick={this.editGroup}>{name}</div>
  }

  renderForm() {
    return (
      <div className="form form--horizontal">
        {this.state.errors.length > 0 && <div className="form-error">{this.state.errors.join('. ')}.</div>}
        <div className="admin-item__form">
          <div className="form__field">
            <select onChange={this.changeValue('ageGroupId')} value={this.state.form.ageGroupId}>
              {this.props.ageGroups.map(ageGroup => {
                const { id, name } = ageGroup
                return <option key={id} value={id}>{name}</option>
              })}
            </select>
          </div>
          <div className="form__field">
            <input type="text" onChange={this.changeValue('name')} value={this.state.form.name} placeholder="Esim. A tai Taso 2"/>
          </div>
          <div className="form__buttons">
            <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary"/>
            <input type="button" value="Peruuta" onClick={this.cancel} className="button"/>
            {!!this.props.group && <input type="button" value="Poista" onClick={this.delete} className="button button--danger"/>}
          </div>
        </div>
      </div>
    )
  }

  editGroup = () => {
    const { ageGroups, group } = this.props
    this.setState({
      formOpen: true,
      form: {
        ageGroupId: group ? group.ageGroupId : ageGroups[0].id,
        name: group ? group.name : '',
      },
    })
  }

  changeValue = field => event => {
    const { form } = this.state
    this.setState({ form: { ...form, [field]: event.target.value } })
  }

  submit = () => {
    const { group, onGroupSave, tournamentId } = this.props
    saveGroup(this.context, tournamentId, group ? group.id : undefined, this.state.form, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onGroupSave(data.id, data)
      }
    })
  }

  cancel = () => {
    this.setState({ formOpen: false, errors: [] })
  }

  delete = () => {
    const { group: { id }, onGroupDelete, tournamentId } = this.props
    deleteGroup(this.context, tournamentId, id, (errors) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onGroupDelete(id)
      }
    })
  }
}
