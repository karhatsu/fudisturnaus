import React from 'react'
import PropTypes from 'prop-types'
import { deleteGroup, saveGroup } from './api_client'
import AccessContext from '../util/access_context'
import { getName, resolveTournamentItemClasses } from '../util/util'
import { idNamePropType } from '../util/custom_prop_types'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'

export default class Group extends React.PureComponent {
  static propTypes = {
    ageGroups: PropTypes.arrayOf(idNamePropType).isRequired,
    group: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      ageGroupId: PropTypes.number.isRequired,
    }),
    onGroupDelete: PropTypes.func,
    onGroupSave: PropTypes.func.isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  static contextType = AccessContext

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
    this.nameFieldRed = React.createRef()
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
    const { ageGroups, group } = this.props
    const text = group ? `${group.name} (${getName(ageGroups, group.ageGroupId)})` : '+ Lisää uusi lohko'
    return <div className={resolveTournamentItemClasses(group)}><span onClick={this.editGroup}>{text}</span></div>
  }

  renderForm() {
    const { form: { ageGroupId, name } } = this.state
    return (
      <form className="form form--horizontal">
        <FormErrors errors={this.state.errors}/>
        <div className="tournament-item__form">
          <div className="form__field">
            <select onChange={this.changeValue('ageGroupId')} value={ageGroupId}>
              <option>Sarja</option>
              {this.props.ageGroups.map(ageGroup => {
                const { id, name } = ageGroup
                return <option key={id} value={id}>{name}</option>
              })}
            </select>
          </div>
          <TextField ref={this.nameFieldRed} onChange={this.changeValue('name')} placeholder="Esim. A tai Taso 2" value={name}/>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={this.submit} type="primary" disabled={!this.canSubmit()}/>
            <Button label="Peruuta" onClick={this.cancel} type="normal"/>
            {!!this.props.group && <Button type="danger" label="Poista" onClick={this.delete}/>}
          </div>
        </div>
      </form>
    )
  }

  editGroup = () => {
    const { group } = this.props
    this.setState({
      formOpen: true,
      form: {
        ageGroupId: group ? group.ageGroupId : -1,
        name: group ? group.name : '',
      },
    })
  }

  changeValue = field => event => {
    const { form } = this.state
    this.setState({ form: { ...form, [field]: event.target.value } })
    if (field === 'ageGroupId' && this.nameFieldRed) {
      this.nameFieldRed.current.focus()
    }
  }

  canSubmit = () => {
    const { form: { ageGroupId, name } } = this.state
    return parseInt(ageGroupId) > 0 && !!name
  }

  submit = () => {
    const { group, onGroupSave, tournamentId } = this.props
    const { form } = this.state
    form.name = form.name.trim()
    saveGroup(this.context, tournamentId, group ? group.id : undefined, form, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onGroupSave(data)
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
