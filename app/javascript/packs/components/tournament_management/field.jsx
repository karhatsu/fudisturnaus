import React from 'react'
import PropTypes from 'prop-types'
import { deleteField, saveField } from './api-client'
import AccessContext from '../util/access_context'

export default class Field extends React.PureComponent {
  static propTypes = {
    field: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
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
    const { field } = this.props
    const text = field ? field.name : '+ Lisää uusi kenttä'
    return <div className="admin-item__title"><span onClick={this.editField}>{text}</span></div>
  }

  renderForm() {
    return (
      <div className="form form--horizontal">
        {this.state.errors.length > 0 && <div className="form-error">{this.state.errors.join('. ')}.</div>}
        <div className="admin-item__form">
          <div className="form__field">
            <input type="text" onChange={this.changeName} value={this.state.name} placeholder="Esim. Kenttä 1"/>
          </div>
          <div className="form__buttons">
            <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary" disabled={!this.canSubmit()}/>
            <input type="button" value="Peruuta" onClick={this.cancel} className="button"/>
            {!!this.props.field && <input type="button" value="Poista" onClick={this.delete} className="button button--danger"/>}
          </div>
        </div>
      </div>
    )
  }

  editField = () => {
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
    saveField(this.context, tournamentId, field ? field.id : undefined, name, (errors, data) => {
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
}
