import React from 'react'
import PropTypes from 'prop-types'
import { deleteAgeGroup, saveAgeGroup } from '../api-client'

export default class AgeGroup extends React.PureComponent {
  static propTypes = {
    ageGroup: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    onAgeGroupDelete: PropTypes.func,
    onAgeGroupSave: PropTypes.func.isRequired,
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
    const { ageGroup } = this.props
    return <div className="field__name" onClick={this.editAgeGroup}>{ageGroup ? ageGroup.name : 'Lisää uusi ikäryhmä'}</div>
  }

  renderForm() {
    return (
      <div>
        {this.state.errors.length > 0 && <div className="form-error">{this.state.errors.join('. ')}.</div>}
        <div className="field__form">
          <div className="form-field">
            <input type="text" onChange={this.changeName} value={this.state.name} placeholder="Esim. P11 tai T09"/>
          </div>
          <div className="submit-button">
            <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary"/>
            <input type="button" value="Peruuta" onClick={this.cancel} className="button"/>
            {!!this.props.ageGroup && <input type="button" value="Poista" onClick={this.delete} className="button button--danger"/>}
          </div>
        </div>
      </div>
    )
  }

  editAgeGroup = () => {
    const { ageGroup } = this.props
    this.setState({ formOpen: true, name: ageGroup ? ageGroup.name : '' })
  }

  changeName = event => {
    this.setState({ name: event.target.value })
  }

  submit = () => {
    const { ageGroup, onAgeGroupSave, sessionKey, tournamentId } = this.props
    const { name } = this.state
    saveAgeGroup(sessionKey, tournamentId, ageGroup ? ageGroup.id : undefined, name, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onAgeGroupSave({ id: data.id, name })
      }
    })
  }

  cancel = () => {
    this.setState({ formOpen: false, errors: [] })
  }

  delete = () => {
    const { ageGroup: { id }, onAgeGroupDelete, sessionKey, tournamentId } = this.props
    deleteAgeGroup(sessionKey, tournamentId, id, (errors) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onAgeGroupDelete(id)
      }
    })
  }
}
