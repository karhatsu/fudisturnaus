import React from 'react'
import PropTypes from 'prop-types'
import { fetchTournament } from './api-client'
import Title from '../title'
import TournamentFields from './tournament_fields'
import AgeGroup from './age_group'
import Group from './group'
import GroupStageMatch from './group_stage_match'
import Field from './field'
import Team from './team'
import AccessContext from '../access_context'

export default class AdminTournamentPage extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  static contextType = AccessContext

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
        <Title iconLink="/admin" loading={!tournament && !error} text={`ADMIN - ${title}`}/>
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
        <div className="title-2">Alkulohkojen ottelut</div>
        {this.renderGroupStageMatchesSection()}
        <div className="title-2">Toimitsijan linkki</div>
        {this.renderOfficialLink()}
      </div>
    )
  }

  componentDidMount() {
    this.fetchTournamentData()
  }

  fetchTournamentData = () => {
    fetchTournament(this.context, this.getTournamentId(), (err, tournament) => {
      if (tournament) {
        const { teams } = tournament
        this.setState({ tournament: { ...tournament, teams: teams.sort(this.getComparator('teams')) } })
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
        <Field onFieldSave={this.onItemSave('fields')} tournamentId={this.getTournamentId()}/>
      </div>
    )
  }

  renderFields() {
    const { tournament: { fields } } = this.state
    return fields.map(field => {
      return <Field
        key={field.id}
        field={field}
        onFieldDelete={this.onItemDelete('fields')}
        onFieldSave={this.onItemSave('fields')}
        tournamentId={this.getTournamentId()}
      />
    })
  }

  renderAgeGroupsSection() {
    return (
      <div className="admin-tournament-page__section">
        {this.renderAgeGroups()}
        <AgeGroup onAgeGroupSave={this.onItemSave('ageGroups')} tournamentId={this.getTournamentId()}/>
      </div>
    )
  }

  renderAgeGroups() {
    const { tournament: { ageGroups } } = this.state
    return ageGroups.map(ageGroup => {
      return <AgeGroup
        key={ageGroup.id}
        ageGroup={ageGroup}
        onAgeGroupDelete={this.onItemDelete('ageGroups')}
        onAgeGroupSave={this.onItemSave('ageGroups')}
        tournamentId={this.getTournamentId()}
      />
    })
  }

  renderGroupsSection() {
    const { tournament: { ageGroups, id } } = this.state
    return (
      <div className="admin-tournament-page__section">
        {ageGroups.length > 0 ? this.renderGroups() : this.renderCannotAddGroups()}
        {ageGroups.length > 0 && <Group ageGroups={ageGroups} onGroupSave={this.onItemSave('groups')} tournamentId={id}/>}
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
        onGroupDelete={this.onItemDelete('groups')}
        onGroupSave={this.onItemSave('groups')}
        tournamentId={this.getTournamentId()}
      />
    })
  }

  renderTeamsSection() {
    const { tournament: { clubs, groups, id } } = this.state
    const canAddTeams = groups.length > 0
    return (
      <div className="admin-tournament-page__section">
        {canAddTeams ? this.renderGroupTeams() : this.renderCannotAddTeams()}
        {canAddTeams && <Team clubs={clubs} groups={groups} onClubSave={this.onClubSave} onTeamSave={this.onItemSave('teams')} tournamentId={id}/>}
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

  renderGroupTeams() {
    const { tournament: { teams } } = this.state
    const teamsByGroups = teams.reduce((groupTeams, team) => {
      const key = `${team.group.name} (${team.group.ageGroupName})`
      if (!groupTeams[key]) {
        groupTeams[key] = []
      }
      groupTeams[key].push(team)
      return groupTeams
    }, {})
    return Object.keys(teamsByGroups).map(group => {
      return (
        <div key={group}>
          <div className="admin-tournament-page__section-title">{group}</div>
          {this.renderTeams(teamsByGroups[group])}
        </div>
      )
    })
  }

  renderTeams(teams) {
    const { tournament: { clubs, groups } } = this.state
    return teams.map(team => {
      return <Team
        key={team.id}
        clubs={clubs}
        groups={groups}
        onClubSave={this.onClubSave}
        onTeamDelete={this.onItemDelete('teams')}
        onTeamSave={this.onItemSave('teams')}
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

  renderGroupStageMatchesSection() {
    const { tournament: { fields, groups, groupStageMatches, teams, id } } = this.state
    const canMatches = teams.length > 1 && fields.length > 0
    return (
      <div className="admin-tournament-page__section">
        {canMatches ? this.renderGroupStageMatches() : this.renderCannotAddGroupStageMatches()}
        {canMatches && <GroupStageMatch
          fields={fields}
          groups={groups}
          groupStageMatches={groupStageMatches}
          onGroupStageMatchSave={this.onItemSave('groupStageMatches')}
          teams={teams}
          tournamentId={id}
          tournamentDate={this.state.tournament.startDate}
        />}
      </div>
    )
  }

  renderCannotAddGroupStageMatches = () => {
    return (
      <div className="admin-item">
        Et voi lisätä otteluita ennen kuin olet lisännyt vähintään yhden kentän ja vähintään kaksi joukkuetta.
      </div>
    )
  }

  renderGroupStageMatches() {
    const { tournament: { fields, groups, groupStageMatches, teams } } = this.state
    return groupStageMatches.map(groupStageMatch => {
      return <GroupStageMatch
        key={groupStageMatch.id}
        fields={fields}
        groups={groups}
        groupStageMatch={groupStageMatch}
        groupStageMatches={groupStageMatches}
        onClubSave={this.onClubSave}
        onGroupStageMatchDelete={this.onItemDelete('groupStageMatches')}
        onGroupStageMatchSave={this.onItemSave('groupStageMatches')}
        teams={teams}
        tournamentId={this.getTournamentId()}
        tournamentDate={this.state.tournament.startDate}
      />
    })
  }

  onItemSave = itemName => data => {
    const items = [...this.state.tournament[itemName]]
    const itemIndex = items.findIndex(item => item.id === data.id)
    if (itemIndex !== -1) {
      items[itemIndex] = { ...items[itemIndex], ...data }
    } else {
      items.push(data)
    }
    this.setState({ tournament: { ...this.state.tournament, [itemName]: items.sort(this.getComparator(itemName)) } })
  }

  onItemDelete = itemName => id => {
    const items = [...this.state.tournament[itemName]]
    const itemIndex = items.findIndex(item => item.id === id)
    items.splice(itemIndex, 1)
    this.setState({ tournament: { ...this.state.tournament, [itemName]: items } })
  }

  getComparator = itemName => {
    switch (itemName) {
      case 'ageGroups':
      case 'fields':
        return (a, b) => a.name.localeCompare(b.name)
      case 'teams':
        return (a, b) => {
          const ageGroupCompare = a.group.ageGroupName.localeCompare(b.group.ageGroupName)
          if (ageGroupCompare !== 0) {
            return ageGroupCompare
          }
          const groupCompare = a.group.name.localeCompare(b.group.name)
          if (groupCompare !== 0) {
            return groupCompare
          }
          return a.name.localeCompare(b.name)
        }
      case 'groups':
        return (a, b) => {
          const ageGroupCompare = a.ageGroupName.localeCompare(b.ageGroupName)
          if (ageGroupCompare !== 0) {
            return ageGroupCompare
          }
          return a.name.localeCompare(b.name)
        }
      case 'groupStageMatches':
        return (a, b) => {
          const timeCompare = a.startTime.localeCompare(b.startTime)
          if (timeCompare !== 0) {
            return timeCompare
          }
          return a.field.name.localeCompare(b.field.name)
        }
      default:
        console.error('No comparator for', itemName) // eslint-disable-line no-console
    }
  }

  renderOfficialLink() {
    const url = `http://www.fudisturnaus.com/official/${this.state.tournament.accessKey}`
    return (
      <div className="form__field form__field--official-link">
        <input type="text" value={url} disabled={true}/>
      </div>
    )
  }

  getTournamentId = () => {
    return parseInt(this.props.match.params.id)
  }
}
