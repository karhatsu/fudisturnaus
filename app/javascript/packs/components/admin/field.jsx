import React from 'react'
import PropTypes from 'prop-types'
import { updateField } from '../api-client'

export default class Field extends React.PureComponent {
  static propTypes = {
    field: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    onSuccessfulSave: PropTypes.func.isRequired,
    sessionKey: PropTypes.string.isRequired,
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
    const { field: { name } } = this.props
    return <div className="field__name" onClick={this.editField}>{name}</div>
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
    const { field: { name } } = this.props
    this.setState({ formOpen: true, name })
  }

  changeName = event => {
    this.setState({ name: event.target.value })
  }

  submit = () => {
    const { field: { id }, onSuccessfulSave, sessionKey } = this.props
    const { name } = this.state
    updateField(sessionKey, id, name, (errors) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onSuccessfulSave({ id, name })
      }
    })
  }

  cancel = () => {
    this.setState({ formOpen: false })
  }
}
