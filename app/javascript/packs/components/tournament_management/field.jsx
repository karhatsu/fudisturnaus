import React from 'react'
import PropTypes from 'prop-types'
import { deleteField, saveField } from './api_client'
import AccessContext from '../util/access_context'
import { resolveTournamentItemClasses } from '../util/util'
import { idNamePropType } from '../util/custom_prop_types'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'

export default class Field extends React.PureComponent {
  static propTypes = {
    field: idNamePropType,
    onFieldDelete: PropTypes.func,
    onFieldSave: PropTypes.func.isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  static contextType = AccessContext

  constructor(props) {
    super(props)
    this.state = {
      formOpen: false,
      name: undefined,
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
    const { field } = this.props
    const text = field ? field.name : '+ Lisää uusi kenttä'
    return <div className={resolveTournamentItemClasses(field)}><span onClick={this.openForm}>{text}</span></div>
  }

  renderForm() {
    const placeholder = 'Esim. Kenttä 1 tai Tekonurmi 2'
    return (
      <form className="form form--horizontal">
        <FormErrors errors={this.state.errors}/>
        <div className="tournament-item__form">
          <TextField ref={this.nameFieldRed} onChange={this.changeName} placeholder={placeholder} value={this.state.name}/>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={this.submit} type="primary" disabled={!this.canSubmit()}/>
            <Button label="Peruuta" onClick={this.cancel} type="normal"/>
            {!!this.props.field && <Button type="danger" label="Poista" onClick={this.delete}/>}
          </div>
        </div>
      </form>
    )
  }

  openForm = () => {
    const { field } = this.props
    this.setState({ formOpen: true, name: field ? field.name : '' })
  }

  changeName = event => {
    this.setState({ name: event.target.value })
  }

  canSubmit = () => {
    return !!this.state.name
  }

  submit = () => {
    const { field, onFieldSave, tournamentId } = this.props
    const { name } = this.state
    saveField(this.context, tournamentId, field ? field.id : undefined, name.trim(), (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onFieldSave(data)
      }
    })
  }

  cancel = () => {
    this.setState({ formOpen: false, errors: [] })
  }

  delete = () => {
    const { field: { id }, onFieldDelete, tournamentId } = this.props
    deleteField(this.context, tournamentId, id, (errors) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onFieldDelete(id)
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.formOpen && this.state.formOpen && this.nameFieldRed) {
      this.nameFieldRed.current.focus()
    }
  }
}
