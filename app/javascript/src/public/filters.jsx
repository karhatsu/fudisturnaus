import React from 'react'
import PropTypes from 'prop-types'
import { resolveDate, resolveWeekDay } from '../util/date_util'
import { getName } from '../util/util'

const Filters = ({ filters, resetFilters, setFilterValue, tournament }) => {
  const renderFilter = (key, items, defaultText, selectedText, nameCallback) => {
    if (items.length > 1) {
      const title = filters[key] > 0 ? selectedText : defaultText
      return (
        <select id={`filter-${key}`} className="filter" onChange={setFilterValue(key)} value={filters[key]}>
          <option value={0}>{title}</option>
          {items.map(item => {
            const { id, name } = item
            return <option key={id} value={id}>{nameCallback ? nameCallback(item) : name}</option>
          })}
        </select>
      )
    }
  }

  const resolveGroupName = group => {
    const { ageGroups } = tournament
    const { ageGroupId, name } = group
    if (filters.ageGroupId || ageGroups.length === 1) {
      return name
    }
    const ageGroupName = getName(ageGroups, ageGroupId)
    return `${name} (${ageGroupName})`
  }

  const resolveAgeGroups = () => {
    const { clubId, groupId, teamId } = filters
    const { ageGroups, teams } = tournament
    if (groupId > 0 || teamId > 0) {
      return []
    }
    return ageGroups.filter(ageGroup => {
      return !clubId || teams.find(team => team.clubId === clubId && team.ageGroupId === ageGroup.id)
    })
  }

  const resolveGroups = () => {
    const { ageGroupId, clubId, teamId } = filters
    const { groups, teams } = tournament
    if (teamId > 0) {
      return []
    }
    return groups.filter(group => {
      return (!ageGroupId || group.ageGroupId === ageGroupId) &&
        (!clubId || teams.find(team => team.clubId === clubId && team.groupId === group.id))
    })
  }

  const resolveClubs = () => {
    const { ageGroupId, groupId, teamId } = filters
    const { clubs, groups, teams } = tournament
    if (teamId > 0) {
      return []
    }
    const filterGroup = groupId ? groups.find(group => group.id === groupId) : null
    return clubs.filter(club => {
      return (!ageGroupId || teams.find(team => team.clubId === club.id && team.ageGroupId === ageGroupId)) &&
        (!filterGroup || filterGroup.results.find(team => team.clubId === club.id))
    })
  }

  const resolveDays = () => {
    const { days: daysCount, startDate } = tournament
    return new Array(daysCount).fill(undefined).map((none, index) => {
      return { id: index + 1, name: `${resolveWeekDay(startDate, index)} ${resolveDate(startDate, index)}` }
    })
  }

  const resolveTeams = () => {
    const { ageGroupId, groupId, clubId } = filters
    const { teams } = tournament
    return teams.filter(team => {
      return (!ageGroupId || team.ageGroupId === ageGroupId) &&
        (!groupId || team.groupId === groupId) &&
        (!clubId || team.clubId === clubId)
    })
  }

  const resolveFields = () => {
    return tournament.fields
  }

  const renderResetLink = () => {
    if (Object.keys(filters).some(key => filters[key] > 0)) {
      return <div onClick={resetFilters} className="filters__reset-link">Näytä kaikki ottelut</div>
    }
  }

  return (
    <div className="filters">
      {renderFilter('ageGroupId', resolveAgeGroups(), 'Sarja', 'Kaikki sarjat')}
      {renderFilter('groupId', resolveGroups(), 'Lohko', 'Kaikki lohkot', resolveGroupName)}
      {renderFilter('clubId', resolveClubs(), 'Seura', 'Kaikki seurat')}
      {renderFilter('teamId', resolveTeams(), 'Joukkue', 'Kaikki joukkueet')}
      {renderFilter('day', resolveDays(), 'Päivä', 'Kaikki päivät')}
      {renderFilter('fieldId', resolveFields(), 'Kenttä', 'Kaikki kentät')}
      {renderResetLink()}
    </div>
  )
}

Filters.propTypes = {
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

export default Filters
