import React from 'react'
import PropTypes from 'prop-types'
import { fetchTournament } from '../api-client'
import Title from '../title'
import AgeGroup from './age_group'
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
    const { sessionKey } = this.props
    const tournamentId = this.getTournamentId()
    return (
      <div>
        <div className="title-2">Kentät</div>
        <div className="admin-tournament-page__section">
          {this.renderFields()}
          <Field onFieldSave={this.onFieldSave} sessionKey={sessionKey} tournamentId={tournamentId}/>
        </div>
        <div className="title-2">Ikäryhmät</div>
        <div className="admin-tournament-page__section">
          {this.renderAgeGroups()}
          <AgeGroup onAgeGroupSave={this.onAgeGroupSave} sessionKey={sessionKey} tournamentId={tournamentId}/>
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
        onFieldDelete={this.onFieldDelete}
        onFieldSave={this.onFieldSave}
        sessionKey={this.props.sessionKey}
        tournamentId={this.getTournamentId()}
      />
    })
  }

  onFieldDelete = id => {
    const fields = [...this.state.tournament.fields]
    const fieldIndex = fields.findIndex(field => field.id === id)
    fields.splice(fieldIndex, 1)
    this.setState({ tournament: { ...this.state.tournament, fields } })
  }

  onFieldSave = data => {
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

  renderAgeGroups() {
    const { tournament: { ageGroups } } = this.state
    return ageGroups.map(ageGroup => {
      return <AgeGroup
        key={ageGroup.id}
        ageGroup={ageGroup}
        onAgeGroupDelete={this.onAgeGroupDelete}
        onAgeGroupSave={this.onAgeGroupSave}
        sessionKey={this.props.sessionKey}
        tournamentId={this.getTournamentId()}
      />
    })
  }

  onAgeGroupDelete = id => {
    const ageGroups = [...this.state.tournament.ageGroups]
    const ageGroupIndex = ageGroups.findIndex(ageGroup => ageGroup.id === id)
    ageGroups.splice(ageGroupIndex, 1)
    this.setState({ tournament: { ...this.state.tournament, ageGroups } })
  }

  onAgeGroupSave = data => {
    const { id, name } = data
    const ageGroups = [...this.state.tournament.ageGroups]
    const ageGroupIndex = ageGroups.findIndex(ageGroup => ageGroup.id === id)
    if (ageGroupIndex !== -1) {
      ageGroups[ageGroupIndex] = { ...ageGroups[ageGroupIndex], name }
    } else {
      ageGroups.push({ id, name })
    }
    this.setState({ tournament: { ...this.state.tournament, ageGroups } })
  }

  getTournamentId = () => {
    return parseInt(this.props.match.params.id)
  }
}
