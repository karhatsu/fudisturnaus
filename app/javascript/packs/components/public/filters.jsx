import React from 'react'
import PropTypes from 'prop-types'

export default class Filters extends React.PureComponent {
  static propTypes = {
    filters: PropTypes.shape({
      ageGroupId: PropTypes.number,
      clubId: PropTypes.number,
      fieldId: PropTypes.number,
      groupId: PropTypes.number,
      teamId: PropTypes.number,
    }).isRequired,
    setFilterValue: PropTypes.func.isRequired,
    tournament: PropTypes.shape({
      ageGroups: PropTypes.array.isRequired,
      clubs: PropTypes.array.isRequired,
      fields: PropTypes.array.isRequired,
      groups: PropTypes.array.isRequired,
      teams: PropTypes.array.isRequired,
    }).isRequired,
  }

  render() {
    return (
      <div className="filters">
        {this.renderFilter('ageGroupId', this.resolveAgeGroups(), 'Sarja')}
        {this.renderFilter('groupId', this.resolveGroups(), 'Lohko')}
        {this.renderFilter('clubId', this.resolveClubs(), 'Seura')}
        {this.renderFilter('teamId', this.resolveTeams(), 'Joukkue')}
        {this.renderFilter('fieldId', this.resolveFields(), 'Kenttä')}
      </div>
    )
  }

  renderFilter = (key, items, defaultText) => {
    if (items.length > 1) {
      return (
        <select id={`filter-${key}`} className="filter" onChange={this.props.setFilterValue(key)} value={this.props.filters[key]}>
          <option value={0}>{defaultText}</option>
          {items.map(item => {
            const { id, name } = item
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
      )
    }
  }

  resolveAgeGroups = () => {
    const { filters: { clubId, groupId, teamId }, tournament: { ageGroups, teams } } = this.props
    if (groupId > 0 || teamId > 0) {
      return []
    }
    return ageGroups.filter(ageGroup => {
      return !clubId || teams.find(team => team.clubId === clubId && team.ageGroupId === ageGroup.id)
    })
  }

  resolveGroups = () => {
    const { filters: { ageGroupId, clubId, teamId }, tournament: { groups, teams } } = this.props
    if (teamId > 0) {
      return []
    }
    return groups.filter(group => {
      return (!ageGroupId || group.ageGroupId === ageGroupId) &&
        (!clubId || teams.find(team => team.clubId === clubId && team.groupId === group.id))
    })
  }

  resolveClubs = () => {
    const { filters: { ageGroupId, groupId, teamId }, tournament: { clubs, groups, teams } } = this.props
    if (teamId > 0) {
      return []
    }
    const filterGroup = groupId ? groups.find(group => group.id === groupId) : null
    return clubs.filter(club => {
      return (!ageGroupId || teams.find(team => team.clubId === club.id && team.ageGroupId === ageGroupId)) &&
        (!filterGroup || filterGroup.teams.find(team => team.clubId === club.id))
    })
  }

  resolveTeams = () => {
    const { filters: { ageGroupId, groupId, clubId }, tournament: { teams } } = this.props
    return teams.filter(team => {
      return (!ageGroupId || team.ageGroupId === ageGroupId) &&
        (!groupId || team.groupId === groupId) &&
        (!clubId || team.clubId === clubId)
    })
  }

  resolveFields = () => {
    const { tournament: { fields } } = this.props
    return fields
  }
}
