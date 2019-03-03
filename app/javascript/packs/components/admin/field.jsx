import React from 'react'
import PropTypes from 'prop-types'
import { saveField } from '../api-client'

export default class Field extends React.PureComponent {
  static propTypes = {
    field: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    onSuccessfulSave: PropTypes.func.isRequired,
    sessionKey: PropTypes.string.isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

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
      <div className="field">
        {this.state.formOpen && this.renderForm()}
        {!this.state.formOpen && this.renderName()}
      </div>
    )
  }

  renderName() {
    const { field } = this.props
    return <div className="field__name" onClick={this.editField}>{field ? field.name : 'Lisää uusi kenttä'}</div>
  }

  renderForm() {
    return (
      <div>
        {this.state.errors.length > 0 && <div className="error match__error">{this.state.errors.join('. ')}.</div>}
        <div className="field__form">
          <div className="form-field">
            <input type="text" onChange={this.changeName} value={this.state.name} placeholder="Kentän nimi"/>
          </div>
          <div className="submit-button">
            <input type="submit" value="Tallenna" onClick={this.submit}/>
            <input type="button" value="Peruuta" onClick={this.cancel}/>
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

  submit = () => {
    const { field, onSuccessfulSave, sessionKey, tournamentId } = this.props
    const { name } = this.state
    saveField(sessionKey, tournamentId, field ? field.id : undefined, name, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onSuccessfulSave({ id: data.id, name })
      }
    })
  }

  cancel = () => {
    this.setState({ formOpen: false, errors: [] })
  }
}
