import React from 'react'
import PropTypes from 'prop-types'
import AccessContext from '../util/access_context'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import { deleteClub, updateClub } from './api_client'

export default class ClubForm extends React.PureComponent {
  static propTypes = {
    club: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    onClubDelete: PropTypes.func.isRequired,
    onClubSave: PropTypes.func.isRequired,
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
    const { club: { name } } = this.props
    return <div className="tournament-item__title"><span onClick={this.openForm}>{name}</span></div>
  }

  renderForm() {
    return (
      <form className="form form--horizontal">
        <FormErrors errors={this.state.errors}/>
        <div className="tournament-item__form">
          <TextField ref={this.nameFieldRed} onChange={this.changeName} value={this.state.name}/>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={this.submit} type="primary" disabled={!this.canSubmit()}/>
            <Button label="Peruuta" onClick={this.cancel} type="normal"/>
            <Button label="Poista" onClick={this.delete} type="danger"/>
          </div>
        </div>
      </form>
    )
  }

  openForm = () => {
    const { club: { name } } = this.props
    this.setState({ formOpen: true, name })
  }

  changeName = event => {
    this.setState({ name: event.target.value })
  }

  canSubmit = () => {
    return !!this.state.name
  }

  submit = () => {
    const { club, onClubSave } = this.props
    const { name } = this.state
    updateClub(this.context, club.id, { name }, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onClubSave(data)
      }
    })
  }

  cancel = () => {
    this.setState({ formOpen: false, errors: [] })
  }

  delete = () => {
    const { club, onClubDelete } = this.props
    deleteClub(this.context, club.id, errors => {
      if (errors) {
        this.setState({ errors })
      } else {
        onClubDelete(club.id)
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.formOpen && this.state.formOpen && this.nameFieldRed) {
      this.nameFieldRed.current.focus()
    }
  }
}
