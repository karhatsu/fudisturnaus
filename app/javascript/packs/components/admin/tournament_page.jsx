import React from 'react'
import PropTypes from 'prop-types'
import { fetchTournament } from '../api-client'
import Title from '../title'
import Field from './field'

export default class AdminTournamentPage extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    sessionKey: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      error: false,
      tournament: undefined,
    }
  }

  render() {
    const { error, tournament } = this.state
    const title = tournament ? tournament.name : 'fudisturnaus.com'
    return (
      <div>
        <Title loading={!tournament && !error} text={`ADMIN - ${title}`}/>
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    if (!this.state.tournament) return null
    return (
      <div>
        <div className="title-2">Kentät</div>
        <div className="admin-tournament-page__section">
          {this.renderFields()}
          <Field onSuccessfulSave={this.onSuccessfulFieldSave} sessionKey={this.props.sessionKey} tournamentId={this.getTournamentId()}/>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.fetchTournamentData()
  }

  fetchTournamentData = () => {
    fetchTournament(this.getTournamentId(), (err, tournament) => {
      if (tournament) {
        this.setState({ tournament })
      } else if (err && !this.state.tournament) {
        this.setState({ error: true })
      }
    })
  }

  renderFields() {
    const { tournament: { fields } } = this.state
    return fields.map(field => {
      return <Field
        key={field.id}
        field={field}
        onSuccessfulSave={this.onSuccessfulFieldSave}
        sessionKey={this.props.sessionKey}
        tournamentId={this.getTournamentId()}
      />
    })
  }

  onSuccessfulFieldSave = data => {
    const { id, name } = data
    const fields = [...this.state.tournament.fields]
    const fieldIndex = fields.findIndex(field => field.id === id)
    if (fieldIndex !== -1) {
      fields[fieldIndex] = { ...fields[fieldIndex], name }
    } else {
      fields.push({ id, name })
    }
    this.setState({ tournament: { ...this.state.tournament, fields } })
  }

  getTournamentId = () => {
    return parseInt(this.props.match.params.id)
  }
}
