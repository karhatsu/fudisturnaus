import React from 'react'
import PropTypes from 'prop-types'
import { resolveDate, resolveWeekDay } from '../util/date_util'
import { getName } from '../util/util'

export default class Filters extends React.PureComponent {
  static propTypes = {
    filters: PropTypes.shape({
      ageGroupId: PropTypes.number,
      clubId: PropTypes.number,
      day: PropTypes.number,
      fieldId: PropTypes.number,
      groupId: PropTypes.number,
      teamId: PropTypes.number,
    }).isRequired,
    resetFilters: PropTypes.func.isRequired,
    setFilterValue: PropTypes.func.isRequired,
    tournament: PropTypes.shape({
      ageGroups: PropTypes.array.isRequired,
      clubs: PropTypes.array.isRequired,
      days: PropTypes.number.isRequired,
      fields: PropTypes.array.isRequired,
      groups: PropTypes.array.isRequired,
      startDate: PropTypes.string.isRequired,
      teams: PropTypes.array.isRequired,
    }).isRequired,
  }

  render() {
    const ageGroups = this.resolveAgeGroups()
    return (
      <div className="filters">
        {this.renderFilter('ageGroupId', ageGroups, 'Sarja')}
        {this.renderFilter('groupId', this.resolveGroups(), 'Lohko', this.resolveGroupName)}
        {this.renderFilter('clubId', this.resolveClubs(), 'Seura')}
        {this.renderFilter('teamId', this.resolveTeams(), 'Joukkue')}
        {this.renderFilter('day', this.resolveDays(), 'Pvm')}
        {this.renderFilter('fieldId', this.resolveFields(), 'Kenttä')}
        {this.renderResetLink()}
      </div>
    )
  }

  renderFilter = (key, items, defaultText, nameCallback) => {
    if (items.length > 1) {
      return (
        <select id={`filter-${key}`} className="filter" onChange={this.props.setFilterValue(key)} value={this.props.filters[key]}>
          <option value={0}>{defaultText}</option>
          {items.map(item => {
            const { id, name } = item
            return <option key={id} value={id}>{nameCallback ? nameCallback(item) : name}</option>
          })}
        </select>
      )
    }
  }

  resolveGroupName = group => {
    const { filters, tournament: { ageGroups } } = this.props
    const { ageGroupId, name } = group
    if (filters.ageGroupId || ageGroups.length === 1) {
      return name
    }
    const ageGroupName = getName(ageGroups, ageGroupId)
    return `${name} (${ageGroupName})`
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

  resolveDays = () => {
    const { tournament: { days: daysCount, startDate } } = this.props
    return new Array(daysCount).fill(undefined).map((none, index) => {
      return { id: index + 1, name: `${resolveWeekDay(startDate, index)} ${resolveDate(startDate, index)}` }
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

  renderResetLink = () => {
    const { filters, resetFilters } = this.props
    if (Object.keys(filters).some(key => filters[key] > 0)) {
      return <div onClick={resetFilters} className="filters__reset-link">Näytä kaikki ottelut</div>
    }
  }
}
