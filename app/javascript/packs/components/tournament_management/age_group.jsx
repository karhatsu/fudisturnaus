import React from 'react'
import PropTypes from 'prop-types'
import { deleteAgeGroup, saveAgeGroup } from './api_client'
import AccessContext from '../util/access_context'
import { resolveTournamentItemClasses } from '../util/util'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'

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
    const showInstructions = this.state.formOpen && !this.props.ageGroup
    return (
      <div className="tournament-item">
        {this.state.formOpen && this.renderForm()}
        {showInstructions && this.renderInstructions()}
        {!this.state.formOpen && this.renderName()}
      </div>
    )
  }

  renderInstructions() {
    return (
      <div className="tournament-item__instructions">
        Jos ikäluokan eri tasoilla on omat jatkopelit, lisää jokaiselle tasolle oma sarja (esim. &quot;P07 haaste&quot;).
        Jos taas ikäluokalla ei ole jatkopelejä, lisää sarja ilman tasoa (esim. &quot;T12&quot;) ja
        määritä tasot omiin lohkoihin alempana.
      </div>
    )
  }

  renderName() {
    const { ageGroup } = this.props
    const text = ageGroup ? ageGroup.name : '+ Lisää uusi sarja'
    return <div className={resolveTournamentItemClasses(ageGroup)}><span onClick={this.editAgeGroup}>{text}</span></div>
  }

  renderForm() {
    const { form: { calculateGroupTables, name } } = this.state
    return (
      <form className="form form--horizontal">
        <FormErrors errors={this.state.errors}/>
        <div className="tournament-item__form">
          <TextField ref={this.nameFieldRed} onChange={this.changeName} placeholder="Esim. P11 tai T09 Haaste" value={name}/>
          <div className="form__field">
            <input type="checkbox" onChange={this.changeCalculateGroupTables} value={true} checked={!!calculateGroupTables}/>
            Laske sarjataulukot
          </div>
          <div className="form__buttons">
            <Button label="Tallenna" onClick={this.submit} type="primary" disabled={!this.canSubmit()}/>
            <Button label="Peruuta" onClick={this.cancel} type="normal"/>
            {!!this.props.ageGroup && <Button type="danger" label="Poista" onClick={this.delete}/>}
          </div>
        </div>
      </form>
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
    const { form } = this.state
    form.name = form.name.trim()
    saveAgeGroup(this.context, tournamentId, ageGroup ? ageGroup.id : undefined, form, (errors, data) => {
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
