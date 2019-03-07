import React from 'react'
import PropTypes from 'prop-types'
import { fetchTournament } from './api-client'
import Title from '../title'
import TournamentFields from './tournament_fields'
import AgeGroup from './age_group'
import Group from './group'
import Field from './field'
import Team from './team'
import AdminSessionKeyContext from './session_key_context'

export default class AdminTournamentPage extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  static contextType = AdminSessionKeyContext

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
    const { tournament } = this.state
    if (!tournament) return null
    return (
      <div>
        <div className="title-2">Perustiedot</div>
        <div className="admin-tournament-page__section">
          <TournamentFields onSave={this.onSave} tournament={tournament}/>
        </div>
        <div className="title-2">Kentät</div>
        {this.renderFieldsSection()}
        <div className="title-2">Ikäryhmät</div>
        {this.renderAgeGroupsSection()}
        <div className="title-2">Lohkot</div>
        {this.renderGroupsSection()}
        <div className="title-2">Joukkueet</div>
        {this.renderTeamsSection()}
      </div>
    )
  }

  componentDidMount() {
    this.fetchTournamentData()
  }

  fetchTournamentData = () => {
    fetchTournament(this.context, this.getTournamentId(), (err, tournament) => {
      if (tournament) {
        this.setState({ tournament })
      } else if (err && !this.state.tournament) {
        this.setState({ error: true })
      }
    })
  }

  onSave = data => {
    const { tournament } = this.state
    this.setState({ tournament: { ...tournament, ...data } })
  }

  renderFieldsSection() {
    return (
      <div className="admin-tournament-page__section">
        {this.renderFields()}
        <Field onFieldSave={this.onFieldSave} tournamentId={this.getTournamentId()}/>
      </div>
    )
  }

  renderFields() {
    const { tournament: { fields } } = this.state
    return fields.map(field => {
      return <Field
        key={field.id}
        field={field}
        onFieldDelete={this.onFieldDelete}
        onFieldSave={this.onFieldSave}
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

  renderAgeGroupsSection() {
    return (
      <div className="admin-tournament-page__section">
        {this.renderAgeGroups()}
        <AgeGroup onAgeGroupSave={this.onAgeGroupSave} tournamentId={this.getTournamentId()}/>
      </div>
    )
  }

  renderAgeGroups() {
    const { tournament: { ageGroups } } = this.state
    return ageGroups.map(ageGroup => {
      return <AgeGroup
        key={ageGroup.id}
        ageGroup={ageGroup}
        onAgeGroupDelete={this.onAgeGroupDelete}
        onAgeGroupSave={this.onAgeGroupSave}
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

  onAgeGroupSave = (id, data) => {
    const ageGroups = [...this.state.tournament.ageGroups]
    const ageGroupIndex = ageGroups.findIndex(ageGroup => ageGroup.id === id)
    if (ageGroupIndex !== -1) {
      ageGroups[ageGroupIndex] = { ...ageGroups[ageGroupIndex], ...data }
    } else {
      ageGroups.push({ id, ...data })
    }
    this.setState({ tournament: { ...this.state.tournament, ageGroups } })
  }

  renderGroupsSection() {
    const { tournament: { ageGroups, id } } = this.state
    return (
      <div className="admin-tournament-page__section">
        {ageGroups.length > 0 ? this.renderGroups() : this.renderCannotAddGroups()}
        {ageGroups.length > 0 && <Group ageGroups={ageGroups} onGroupSave={this.onGroupSave} tournamentId={id}/>}
      </div>
    )
  }

  renderCannotAddGroups = () => {
    return (
      <div className="admin-item">
        Et voi lisätä lohkoja ennen kuin olet lisännyt vähintään yhden ikäryhmän.
      </div>
    )
  }

  renderGroups() {
    const { tournament: { ageGroups, groups } } = this.state
    return groups.map(group => {
      return <Group
        key={group.id}
        ageGroups={ageGroups}
        group={group}
        onGroupDelete={this.onGroupDelete}
        onGroupSave={this.onGroupSave}
        tournamentId={this.getTournamentId()}
      />
    })
  }

  onGroupDelete = id => {
    const groups = [...this.state.tournament.groups]
    const groupIndex = groups.findIndex(group => group.id === id)
    groups.splice(groupIndex, 1)
    this.setState({ tournament: { ...this.state.tournament, groups } })
  }

  onGroupSave = (id, data) => {
    const groups = [...this.state.tournament.groups]
    const groupIndex = groups.findIndex(group => group.id === id)
    if (groupIndex !== -1) {
      groups[groupIndex] = { ...groups[groupIndex], ...data }
    } else {
      groups.push({ id, ...data })
    }
    this.setState({ tournament: { ...this.state.tournament, groups } })
  }

  renderTeamsSection() {
    const { tournament: { clubs, groups, id } } = this.state
    const canAddTeams = groups.length > 0
    return (
      <div className="admin-tournament-page__section">
        {canAddTeams ? this.renderTeams() : this.renderCannotAddTeams()}
        {canAddTeams && <Team clubs={clubs} groups={groups} onClubSave={this.onClubSave} onTeamSave={this.onTeamSave} tournamentId={id}/>}
      </div>
    )
  }

  renderCannotAddTeams = () => {
    return (
      <div className="admin-item">
        Et voi lisätä joukkueita ennen kuin olet lisännyt vähintään yhden lohkon.
      </div>
    )
  }

  renderTeams() {
    const { tournament: { clubs, groups, teams } } = this.state
    return teams.map(team => {
      return <Team
        key={team.id}
        clubs={clubs}
        groups={groups}
        onClubSave={this.onClubSave}
        onTeamDelete={this.onTeamDelete}
        onTeamSave={this.onTeamSave}
        team={team}
        tournamentId={this.getTournamentId()}
      />
    })
  }

  onClubSave = data => {
    const clubs = [...this.state.tournament.clubs]
    const clubIndex = clubs.findIndex(club => club.id === data.id)
    if (clubIndex === -1) {
      clubs.push(data)
      clubs.sort((a, b) => a.name.localeCompare(b.name))
      this.setState({ tournament: { ...this.state.tournament, clubs } })
    }
  }

  onTeamDelete = id => {
    const teams = [...this.state.tournament.teams]
    const teamIndex = teams.findIndex(team => team.id === id)
    teams.splice(teamIndex, 1)
    this.setState({ tournament: { ...this.state.tournament, teams } })
  }

  onTeamSave = (id, data) => {
    const teams = [...this.state.tournament.teams]
    const teamIndex = teams.findIndex(team => team.id === id)
    if (teamIndex !== -1) {
      teams[teamIndex] = { ...teams[teamIndex], ...data }
    } else {
      teams.push({ id, ...data })
    }
    this.setState({ tournament: { ...this.state.tournament, teams } })
  }

  getTournamentId = () => {
    return parseInt(this.props.match.params.id)
  }
}
