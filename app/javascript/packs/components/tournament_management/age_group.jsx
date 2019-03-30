import React from 'react'
import PropTypes from 'prop-types'
import { deleteAgeGroup, saveAgeGroup } from './api_client'
import AccessContext from '../util/access_context'

export default class AgeGroup extends React.PureComponent {
  static propTypes = {
    ageGroup: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      calculateGroupTables: PropTypes.bool.isRequired,
    }),
    onAgeGroupDelete: PropTypes.func,
    onAgeGroupSave: PropTypes.func.isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  static contextType = AccessContext

  constructor(props) {
    super(props)
    this.state = {
      formOpen: false,
      form: {
        name: undefined,
        calculateGroupTables: undefined,
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
    const { ageGroup } = this.props
    const text = ageGroup ? ageGroup.name : '+ Lisää uusi sarja'
    return <div className="tournament-item__title"><span onClick={this.editAgeGroup}>{text}</span></div>
  }

  renderForm() {
    const checked = !!this.state.form.calculateGroupTables
    return (
      <div className="form form--horizontal">
        {this.state.errors.length > 0 && <div className="form-error">{this.state.errors.join('. ')}.</div>}
        <div className="tournament-item__form">
          <div className="form__field">
            <input ref={this.nameFieldRed} type="text" onChange={this.changeName} value={this.state.form.name} placeholder="Esim. P11 tai T09"/>
          </div>
          <div className="form__field">
            <input type="checkbox" onChange={this.changeCalculateGroupTables} value={true} checked={checked}/>
            Laske sarjataulukot
          </div>
          <div className="form__buttons">
            <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary" disabled={!this.canSubmit()}/>
            <input type="button" value="Peruuta" onClick={this.cancel} className="button"/>
            {!!this.props.ageGroup && <input type="button" value="Poista" onClick={this.delete} className="button button--danger"/>}
          </div>
        </div>
      </div>
    )
  }

  editAgeGroup = () => {
    const { ageGroup } = this.props
    this.setState({
      formOpen: true,
      form: {
        name: ageGroup ? ageGroup.name : '',
        calculateGroupTables: ageGroup && ageGroup.calculateGroupTables,
      },
    })
  }

  changeName = event => {
    const { form } = this.state
    this.setState({ form: { ...form, name: event.target.value } })
  }

  changeCalculateGroupTables = event => {
    const { form } = this.state
    this.setState({ form: { ...form, calculateGroupTables: event.target.checked } })
  }

  canSubmit = () => {
    return !!this.state.form.name
  }

  submit = () => {
    const { ageGroup, onAgeGroupSave, tournamentId } = this.props
    saveAgeGroup(this.context, tournamentId, ageGroup ? ageGroup.id : undefined, this.state.form, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onAgeGroupSave(data)
      }
    })
  }

  cancel = () => {
    this.setState({ formOpen: false, errors: [] })
  }

  delete = () => {
    const { ageGroup: { id }, onAgeGroupDelete, tournamentId } = this.props
    deleteAgeGroup(this.context, tournamentId, id, (errors) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onAgeGroupDelete(id)
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.formOpen && this.state.formOpen && this.nameFieldRed) {
      this.nameFieldRed.current.focus()
    }
  }
}
