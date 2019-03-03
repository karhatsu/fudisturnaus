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
    const { field: { name } } = this.props
    if (this.state.formOpen) {
      return this.renderForm()
    }
    return <div onClick={this.editField}>{name}</div>
  }

  renderForm() {
    return (
      <div>
        {this.state.errors.length > 0 && <div className="error match__error">{this.state.errors.join('. ')}.</div>}
        <div className="row">
          <input type="text" onChange={this.changeName} value={this.state.name} placeholder="Kentän nimi"/>
          <input type="submit" value="Tallenna" onClick={this.submit}/>
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
}
