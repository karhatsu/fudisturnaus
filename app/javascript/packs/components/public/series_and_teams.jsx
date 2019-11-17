import React from 'react'
import PropTypes from 'prop-types'
import Team from './team'

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
        <div className="series-and-teams__groups">{this.renderGroups(id)}</div>
      </div>
    )
  }

  renderGroups = ageGroupId => {
    const ageGroupTeams = this.props.tournament.teams.filter(team => team.ageGroupId === ageGroupId)
    if (!ageGroupTeams.length) {
      const msg = `${this.oneAgeGroup() ? 'Turnaukseen' : 'Sarjaan'} ei ole ilmoittautunut vielä yhtään joukkuetta`
      return <div className="series-and-teams__no-teams">{msg}</div>
    }
    const groups = this.props.tournament.groups.filter(group => group.ageGroupId === ageGroupId)
    return groups.map(group => this.renderGroup(group, groups.length > 1))
  }

  renderGroup = (group, multipleGroups) => {
    const teams = this.props.tournament.teams.filter(team => team.groupId === group.id)
    if (!teams.length) return
    return (
      <div className="series-and-teams__group" key={group.id}>
        {multipleGroups && <div className="series-and-teams__group-title">{group.name}</div>}
        {teams.map(this.renderTeam)}
      </div>
    )
  }

  renderTeam = (team) => {
    const { tournament: { clubs } } = this.props
    const { clubId, id, name: teamName } = team
    return <div className="series-and-teams__team" key={id}><Team clubId={clubId} clubs={clubs} name={teamName}/></div>
  }

  oneAgeGroup = () => {
    return this.props.tournament.ageGroups.length === 1
  }
}
