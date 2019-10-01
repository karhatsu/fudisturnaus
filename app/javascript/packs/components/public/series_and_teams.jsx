import React from 'react'
import PropTypes from 'prop-types'
import Team from './team'
import { getName } from '../util/util'

export default class SeriesAndTeams extends React.PureComponent {
  static propTypes = {
    tournament: PropTypes.shape({
      ageGroups: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })).isRequired,
      clubs: PropTypes.arrayOf(PropTypes.shape({
        logoUrl: PropTypes.string,
      })).isRequired,
      groups: PropTypes.arrayOf(PropTypes.shape({
        ageGroupId: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })).isRequired,
      teams: PropTypes.arrayOf(PropTypes.shape({
        ageGroupId: PropTypes.number.isRequired,
        clubId: PropTypes.number.isRequired,
        groupId: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  }

  render() {
    return (
      <div className="series-and-teams">
        <div className="message message--warning message--full-page">Turnauksen otteluohjelma julkaistaan myöhemmin</div>
        {this.props.tournament.ageGroups.map(this.renderAgeGroup)}
      </div>
    )
  }

  renderAgeGroup = ageGroup => {
    const { id, name } = ageGroup
    const ageGroupTitle = this.oneAgeGroup() ? 'Ilmoittautuneet joukkueet' : name
    return (
      <div className="series-and-teams__age-group" key={id}>
        <div className="title-2">{ageGroupTitle}</div>
        <div className="series-and-teams__age-group-teams">{this.renderTeams(id)}</div>
      </div>
    )
  }

  renderTeams = ageGroupId => {
    const teams = this.props.tournament.teams.filter(team => team.ageGroupId === ageGroupId)
    if (!teams.length) {
      const msg = `${this.oneAgeGroup() ? 'Turnaukseen' : 'Sarjaan'} ei ole ilmoittautunut vielä yhtään joukkuetta`
      return <div className="series-and-teams__age-group-no-teams">{msg}</div>
    }
    return teams.map(team => this.renderTeam(team, this.multipleGroupsInAgeGroup(ageGroupId)))
  }

  renderTeam = (team, showGroupName) => {
    const { tournament: { clubs, groups } } = this.props
    const { clubId, groupId, id, name: teamName } = team
    const groupName = getName(groups, groupId)
    const name = showGroupName ? `${teamName} (${groupName})` : teamName
    return <div className="series-and-teams__team" key={id}><Team clubId={clubId} clubs={clubs} name={name}/></div>
  }

  oneAgeGroup = () => {
    return this.props.tournament.ageGroups.length === 1
  }

  multipleGroupsInAgeGroup = ageGroupId => {
    return this.props.tournament.groups.filter(group => group.ageGroupId === ageGroupId).length > 1
  }
}
