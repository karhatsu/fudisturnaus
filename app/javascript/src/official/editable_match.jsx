import React from 'react'
import PropTypes from 'prop-types'
import Match from '../public/match'
import { matchTypes } from '../util/enums'
import { saveResult } from '../tournament_management/api_client'
import AccessContext from '../util/access_context'
import Button from '../form/button'

export default class EditableMatch extends Match {
  static propTypes = {
    match: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      field: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      title: PropTypes.string,
      homeTeam: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      awayTeam: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      homeGoals: PropTypes.number,
      awayGoals: PropTypes.number,
      penalties: PropTypes.bool,
      ageGroup: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      group: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }).isRequired,
    selectedClubId: PropTypes.number,
    selectedTeamId: PropTypes.number,
    tournamentId: PropTypes.number.isRequired,
  }

  static contextType = AccessContext

  constructor(props) {
    super(props)
    this.state = { formOpen: false, errors: [] }
    this.homeGoalsRef = React.createRef()
  }

  resolveMainClasses() {
    return 'match match--editable'
  }

  renderResult() {
    const { match: { homeTeam, awayTeam, homeGoals, awayGoals, penalties } } = this.props
    if (this.state.formOpen) {
      return this.renderForm()
    }
    if (homeGoals || homeGoals === 0) {
      return <span>{homeGoals} - {awayGoals}{penalties ? ' rp' : ''}</span>
    } else if (homeTeam && awayTeam) {
      return <span className="match__no-result">Tulos</span>
    }
  }

  renderForm() {
    return (
      <form>
        <div className="match__result-fields">
          {this.renderGoalsField('homeGoals', 1, this.homeGoalsRef)}
          <span className="match__goals-separator">-</span>
          {this.renderGoalsField('awayGoals', 2)}
        </div>
        {this.renderPenaltiesField()}
        <div className="match__buttons">
          <Button onClick={this.saveResult} label="&#x2713;" type="primary" size="small" disabled={!this.canSubmit()} />
          <Button onClick={this.cancel} label="&#x2715;" type="normal" size="small" />
        </div>
      </form>
    )
  }

  renderGoalsField(name, tabIndex, ref) {
    const goals = this.state[name]
    const value = goals || goals === 0 ? goals : ''
    return (
      <input
        type="number"
        value={value}
        onChange={this.setGoals(name)}
        className="match__goals-field"
        tabIndex={tabIndex}
        ref={ref}
      />
    )
  }

  renderPenaltiesField() {
    if (this.props.match.type === matchTypes.playoff) {
      return (
        <div className="match__penalties">
          <input type="checkbox" value={true} checked={this.state.penalties} onChange={this.setPenalties}/> rp
        </div>
      )
    }
  }

  renderErrors() {
    if (this.state.errors.length > 0) {
      return <div className="form-error">{this.state.errors.join('. ')}.</div>
    }
  }

  onClick = () => {
    const { match: { homeTeam, awayTeam, homeGoals, awayGoals, penalties } } = this.props
    if (!this.state.formOpen && homeTeam && awayTeam) {
      this.setState({
        formOpen: true,
        homeGoals: this.initialValue(homeGoals),
        awayGoals: this.initialValue(awayGoals),
        initialHomeGoals: this.initialValue(homeGoals),
        initialAwayGoals: this.initialValue(awayGoals),
        penalties,
        initialPenalties: penalties,
      })
    }
  }

  initialValue = value => value !== null ? value.toString() : ''

  canSubmit = () => {
    const { homeGoals, awayGoals, penalties, initialHomeGoals, initialAwayGoals, initialPenalties } = this.state
    const changed = homeGoals !== initialHomeGoals || awayGoals !== initialAwayGoals || penalties !== initialPenalties
    const both = (homeGoals === '' && awayGoals === '') || (this.isNumber(homeGoals) && this.isNumber(awayGoals))
    return changed && both
  }

  isNumber = value => {
    return parseInt(value).toString() === value
  }

  cancel = () => {
    this.setState({ formOpen: false, errors: [] })
  }

  setGoals = name => event => this.setState({ [name]: event.target.value })

  setPenalties = event => {
    this.setState({ penalties: event.target.checked })
  }

  saveResult = () => {
    const { match: { id, type }, tournamentId } = this.props
    const { homeGoals, awayGoals, penalties } = this.state
    saveResult(this.context, tournamentId, type, id, parseInt(homeGoals), parseInt(awayGoals), penalties, (errors) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.formOpen && this.state.formOpen) {
      this.homeGoalsRef.current.focus()
    }
  }
}
