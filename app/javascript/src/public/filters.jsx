import React from 'react'
import { resolveDate, resolveWeekDay } from '../util/date_util'
import { getName } from '../util/util'

export const defaultFilters = {
  ageGroupId: 0,
  clubId: 0,
  date: '',
  fieldId: 0,
  groupId: 0,
  teamId: 0,
}

const Filters = ({ filters, onGoToGroupTables, resetFilters, setFilterValue, tournament }) => {
  const renderFilter = (key, items, defaultText, selectedText, nameCallback) => {
    if (items.length > 1) {
      const defaultValue = key === 'date' ? '' : 0
      const title = filters[key] > 0 ? selectedText : defaultText
      return (
        <select id={`filter-${key}`} className="filter" onChange={setFilterValue(key)} value={filters[key]}>
          <option value={defaultValue}>{title}</option>
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
    const { dates } = tournament
    return dates.map(date => {
      return { id: date, name: `${resolveWeekDay(date, 0)} ${resolveDate(date, 0)}` }
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
    if (Object.keys(filters).some(key => filters[key] !== defaultFilters[key])) {
      return <div onClick={resetFilters} className="filters__links__link">Näytä kaikki ottelut</div>
    }
  }

  const renderGoToGroupTables = () => {
    return onGoToGroupTables && <div onClick={onGoToGroupTables} className="filters__links__link">Siirry sarjataulukoihin</div>
  }

  return (
    <div className="filters">
      {renderFilter('ageGroupId', resolveAgeGroups(), 'Sarja', 'Kaikki sarjat')}
      {renderFilter('groupId', resolveGroups(), 'Lohko', 'Kaikki lohkot', resolveGroupName)}
      {renderFilter('clubId', resolveClubs(), 'Seura', 'Kaikki seurat')}
      {renderFilter('teamId', resolveTeams(), 'Joukkue', 'Kaikki joukkueet')}
      {renderFilter('date', resolveDays(), 'Päivä', 'Kaikki päivät')}
      {renderFilter('fieldId', resolveFields(), 'Kenttä', 'Kaikki kentät')}
      <div className="filters__links">
        {renderResetLink()}
        {renderGoToGroupTables()}
      </div>
    </div>
  )
}

export default Filters
