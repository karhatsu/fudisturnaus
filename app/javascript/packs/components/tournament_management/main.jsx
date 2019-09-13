import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { fetchTournament, updateTournament } from './api_client'
import Title from '../components/title'
import TournamentFields from './tournament_fields'
import AgeGroup from './age_group'
import Group from './group'
import GroupStageMatch from './group_stage_match'
import PlayoffMatch from './playoff_match'
import Field from './field'
import Team from './team'
import Lottery from './lottery'
import AccessContext from '../util/access_context'
import { getName } from '../util/util'
import OfficialLinkCopy from './official_link_copy'

/* eslint-disable max-len */
const linkTexts = {
  accessKey: {
    description: 'Tällä linkillä pääsee hallinnoimaan turnauksen kaikkia asetuksia sekä syöttämään tuloksia. Jaa se vain turnauksen toimihenkilöille.',
    title: 'Kopioi linkki hallintasivuille',
  },
  resultsAccessKey: {
    description: 'Tällä linkillä pääsee syöttämään tuloksia. Voit jakaa sen esim. turnauksen tuomareille.',
    title: 'Kopioi linkki tulosten syöttöön',
  },
  publicLink: {
    description: 'Tällä linkillä pääsee katsomaan tuloksia. Voit jakaa sen kenelle tahansa, esim. turnaukseen osallistuville joukkueille.',
    title: 'Kopioi julkinen linkki',
  },
}
/* eslint-enable max-len */

export default class TournamentManagementPage extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    official: PropTypes.bool.isRequired,
    titleIconLink: PropTypes.string.isRequired,
    tournamentId: PropTypes.number,
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
    const titlePrefix = tournament ? tournament.name : 'fudisturnaus.com'
    const title = `${titlePrefix} - Hallintasivut`
    return (
      <div>
        <Title iconLink={this.props.titleIconLink} loading={!tournament && !error} text={title}/>
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
        <div className="tournament-management__section tournament-management__section--tournament">
          <TournamentFields onSave={this.onSave} tournament={tournament}/>
        </div>
        <div className="title-2">Kentät</div>
        {this.renderFieldsSection()}
        <div className="title-2">Sarjat</div>
        {this.renderAgeGroupsSection()}
        <div className="title-2">Lohkot</div>
        {this.renderGroupsSection()}
        <div className="title-2">Joukkueet</div>
        {this.renderTeamsSection()}
        <div className="title-2">Alkulohkojen ottelut</div>
        {this.renderGroupStageMatchesSection()}
        <div className="title-2">Tasatilanteen ratkaisu arvalla</div>
        {this.renderLotterySection()}
        <div className="title-2">Jatko-ottelut</div>
        {this.renderPlayoffMatchesSection()}
        <div className="title-2">Turnauksen linkit</div>
        {this.renderTournamentLinks()}
        {this.renderBackLink()}
      </div>
    )
  }

  componentDidMount() {
    this.fetchTournamentData()
  }

  fetchTournamentData = () => {
    fetchTournament(this.context, this.getTournamentId(), (err, tournament) => {
      if (tournament) {
        const teams = [...tournament.teams]
        this.setState({ tournament: { ...tournament, teams: teams.sort(this.getComparator(tournament, 'teams')) } })
      } else if (err && !this.state.tournament) {
        this.setState({ error: true })
      }
    })
  }

  onSave = (form, callback) => {
    updateTournament(this.context, this.getTournamentId(), form, (errors, data) => {
      callback(errors, data)
      this.fetchTournamentData()
    })
  }

  renderFieldsSection() {
    return (
      <div className="tournament-management__section tournament-management__section--fields">
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
      <div className="tournament-management__section tournament-management__section--age-groups">
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
      <div className="tournament-management__section tournament-management__section--groups">
        {ageGroups.length > 0 ? this.renderGroups() : this.renderCannotAddGroups()}
        {ageGroups.length > 0 && <Group ageGroups={ageGroups} onGroupSave={this.onItemSave('groups')} tournamentId={id}/>}
      </div>
    )
  }

  renderCannotAddGroups = () => {
    return (
      <div className="tournament-item">
        Et voi lisätä lohkoja ennen kuin olet lisännyt vähintään yhden sarjan.
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
    const { tournament: { ageGroups, clubs, groups, id } } = this.state
    const canAddTeams = groups.length > 0
    return (
      <div className="tournament-management__section tournament-management__section--teams">
        {canAddTeams ? this.renderGroupTeams() : this.renderCannotAddTeams()}
        {canAddTeams && <Team
          ageGroups={ageGroups}
          clubs={clubs}
          groups={groups}
          onClubSave={this.onClubSave}
          onTeamSave={this.onItemSave('teams')}
          tournamentId={id}
        />}
      </div>
    )
  }

  renderCannotAddTeams = () => {
    return (
      <div className="tournament-item">
        Et voi lisätä joukkueita ennen kuin olet lisännyt vähintään yhden lohkon.
      </div>
    )
  }

  renderGroupTeams() {
    const { tournament: { ageGroups, groups, teams } } = this.state
    const teamsByGroups = teams.reduce((groupTeams, team) => {
      const { groupId } = team
      const group = groups.find(g => g.id === groupId)
      const key = `${group.name} (${getName(ageGroups, group.ageGroupId)})`
      if (!groupTeams[key]) {
        groupTeams[key] = []
      }
      groupTeams[key].push(team)
      return groupTeams
    }, {})
    return Object.keys(teamsByGroups).map(group => {
      return (
        <div key={group}>
          <div className="tournament-management__section-title">{group}</div>
          {this.renderTeams(teamsByGroups[group])}
        </div>
      )
    })
  }

  renderTeams(teams) {
    const { tournament: { ageGroups, clubs, groups } } = this.state
    return teams.map(team => {
      return <Team
        key={team.id}
        ageGroups={ageGroups}
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
    const { tournament: { ageGroups, days, fields, groups, groupStageMatches, teams, id, matchMinutes } } = this.state
    const canMatches = teams.length > 1 && fields.length > 0
    return (
      <div className="tournament-management__section tournament-management__section--group-stage-matches">
        {canMatches ? this.renderGroupStageMatches() : this.renderCannotAddGroupStageMatches()}
        {canMatches && <GroupStageMatch
          ageGroups={ageGroups}
          fields={fields}
          groups={groups}
          groupStageMatches={groupStageMatches}
          onGroupStageMatchSave={this.onItemSave('groupStageMatches')}
          matchMinutes={matchMinutes}
          teams={teams}
          tournamentDays={days}
          tournamentId={id}
          tournamentDate={this.state.tournament.startDate}
        />}
      </div>
    )
  }

  renderCannotAddGroupStageMatches = () => {
    return (
      <div className="tournament-item">
        Et voi lisätä otteluita ennen kuin olet lisännyt vähintään yhden kentän ja vähintään kaksi joukkuetta.
      </div>
    )
  }

  renderGroupStageMatches() {
    const { tournament: { ageGroups, days, fields, groups, groupStageMatches, teams, matchMinutes } } = this.state
    return groupStageMatches.map(groupStageMatch => {
      return <GroupStageMatch
        key={groupStageMatch.id}
        ageGroups={ageGroups}
        fields={fields}
        groups={groups}
        groupStageMatch={groupStageMatch}
        groupStageMatches={groupStageMatches}
        onClubSave={this.onClubSave}
        onGroupStageMatchDelete={this.onItemDelete('groupStageMatches')}
        onGroupStageMatchSave={this.onItemSave('groupStageMatches')}
        matchMinutes={matchMinutes}
        teams={teams}
        tournamentDays={days}
        tournamentId={this.getTournamentId()}
        tournamentDate={this.state.tournament.startDate}
      />
    })
  }

  renderLotterySection() {
    const { tournament: { ageGroups, groups } } = this.state
    return (
      <div className="tournament-management__section tournament-management__section--lottery">
        <Lottery ageGroups={ageGroups} groups={groups} onLotterySave={this.onLotterySave} tournamentId={this.getTournamentId()}/>
      </div>
    )
  }

  onLotterySave = (groupId, data) => {
    const groups = [...this.state.tournament.groups]
    const index = groups.findIndex(group => group.id === groupId)
    groups[index] = { ...groups[index], results: data.results }
    this.setState({ tournament: { ...this.state.tournament, groups } })
  }

  renderPlayoffMatchesSection() {
    const { tournament: { ageGroups, days, fields, groups, playoffMatches, teams, id, matchMinutes } } = this.state
    const ageGroupsIdsWithTables = ageGroups.filter(ageGroup => ageGroup.calculateGroupTables).map(ageGroup => ageGroup.id)
    const groupIdsWithTables = groups.filter(group => ageGroupsIdsWithTables.includes(group.ageGroupId)).map(group => group.id)
    const teamsWithTables = teams.filter(team => groupIdsWithTables.includes(team.groupId))
    const canAddMatches = teamsWithTables.length > 1 && fields.length > 0
    return (
      <div className="tournament-management__section tournament-management__section--playoff-matches">
        {canAddMatches ? this.renderPlayoffMatches() : this.renderCannotAddPlayoffMatches()}
        {canAddMatches && <PlayoffMatch
          ageGroups={ageGroups}
          fields={fields}
          groups={groups}
          playoffMatches={playoffMatches}
          onPlayoffMatchSave={this.onItemSave('playoffMatches')}
          matchMinutes={matchMinutes}
          teams={teams}
          tournamentDays={days}
          tournamentId={id}
          tournamentDate={this.state.tournament.startDate}
        />}
      </div>
    )
  }

  renderCannotAddPlayoffMatches = () => {
    return (
      <div className="tournament-item">
        Jatko-otteluiden lisääminen vaatii vähintään yhden kentän sekä vähintään kaksi joukkuetta sarjassa,
        jolle lasketaan sarjataulukot.
      </div>
    )
  }

  renderPlayoffMatches() {
    const { tournament: { ageGroups, days, fields, groups, playoffMatches, teams, matchMinutes } } = this.state
    return playoffMatches.map(playoffMatch => {
      return <PlayoffMatch
        ageGroups={ageGroups}
        key={playoffMatch.id}
        fields={fields}
        groups={groups}
        playoffMatch={playoffMatch}
        playoffMatches={playoffMatches}
        onPlayoffMatchDelete={this.onItemDelete('playoffMatches')}
        onPlayoffMatchSave={this.onItemSave('playoffMatches')}
        matchMinutes={matchMinutes}
        teams={teams}
        tournamentDays={days}
        tournamentId={this.getTournamentId()}
        tournamentDate={this.state.tournament.startDate}
      />
    })
  }

  onItemSave = itemName => data => {
    const tournament = { ...this.state.tournament }
    const items = [...tournament[itemName]]
    const itemIndex = items.findIndex(item => item.id === data.id)
    if (itemIndex !== -1) {
      items[itemIndex] = { ...items[itemIndex], ...data }
    } else {
      items.push(data)
    }
    this.setState({ tournament: { ...tournament, [itemName]: items.sort(this.getComparator(tournament, itemName)) } })
  }

  onItemDelete = itemName => id => {
    const items = [...this.state.tournament[itemName]]
    const itemIndex = items.findIndex(item => item.id === id)
    items.splice(itemIndex, 1)
    this.setState({ tournament: { ...this.state.tournament, [itemName]: items } })
  }

  getComparator = (tournament, itemName) => {
    switch (itemName) {
      case 'ageGroups':
      case 'fields':
        return (a, b) => a.name.localeCompare(b.name)
      case 'teams':
        return (a, b) => {
          const { ageGroups, groups } = tournament
          const ageGroupCompare = getName(ageGroups, a.ageGroupId).localeCompare(getName(ageGroups, b.ageGroupId))
          if (ageGroupCompare !== 0) {
            return ageGroupCompare
          }
          const groupCompare = getName(groups, a.groupId).localeCompare(getName(groups, b.groupId))
          if (groupCompare !== 0) {
            return groupCompare
          }
          return a.name.localeCompare(b.name)
        }
      case 'groups':
        return (a, b) => {
          const { ageGroups } = tournament
          const ageGroupCompare = getName(ageGroups, a.ageGroupId).localeCompare(getName(ageGroups, b.ageGroupId))
          if (ageGroupCompare !== 0) {
            return ageGroupCompare
          }
          return a.name.localeCompare(b.name)
        }
      case 'groupStageMatches':
      case 'playoffMatches':
        return (a, b) => {
          const { fields } = tournament
          const timeCompare = a.startTime.localeCompare(b.startTime)
          if (timeCompare !== 0) {
            return timeCompare
          }
          return getName(fields, a.fieldId).localeCompare(getName(fields, b.fieldId))
        }
      default:
        console.error('No comparator for', itemName) // eslint-disable-line no-console
    }
  }

  renderTournamentLinks() {
    const { tournament } = this.state
    const { accessKey, resultsAccessKey, publicLink } = linkTexts
    return (
      <React.Fragment>
        <OfficialLinkCopy
          description={accessKey.description}
          path={`/official/${tournament.accessKey}`}
          title={accessKey.title}
        />
        <OfficialLinkCopy
          description={resultsAccessKey.description}
          path={`/results/${tournament.resultsAccessKey}`}
          title={resultsAccessKey.title}
        />
        <OfficialLinkCopy
          description={publicLink.description}
          path={`/tournaments/${tournament.id}`}
          title={publicLink.title}
        />
      </React.Fragment>
    )
  }

  renderBackLink() {
    if (this.props.official) {
      const to = `/official/${this.state.tournament.accessKey}`
      return (
        <React.Fragment>
          <div className="title-2">Takaisin tulosten syöttöön</div>
          <div className="tournament-management__section">
            <Link to={to} className="back-link">&lt;- Takaisin tulosten syöttöön</Link>
          </div>
        </React.Fragment>
      )
    }
  }

  getTournamentId = () => {
    return this.props.tournamentId || parseInt(this.props.match.params.id)
  }
}
