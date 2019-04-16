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
    const { tournament: { ageGroups, clubs, fields } } = this.props
    return (
      <div className="filters">
        {this.renderFilter('ageGroupId', ageGroups, 'Sarja')}
        {this.renderFilter('groupId', this.resolveGroups(), 'Lohko')}
        {this.renderFilter('clubId', clubs, 'Seura')}
        {this.renderFilter('teamId', this.resolveTeams(), 'Joukkue')}
        {this.renderFilter('fieldId', fields, 'Kenttä')}
      </div>
    )
  }

  renderFilter = (key, items, defaultText) => {
    if (items.length > 1) {
      return (
        <select id={`filter-${key}`} className="filter" onChange={this.props.setFilterValue(key)}>
          <option>{defaultText}</option>
          {items.map(item => {
            const { id, name } = item
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
      )
    }
  }

  resolveGroups = () => {
    const { filters: { ageGroupId: filterAgeGroupId }, tournament: { groups } } = this.props
    return groups.filter(group => !filterAgeGroupId || group.ageGroupId === filterAgeGroupId)
  }

  resolveTeams = () => {
    const { filters: { clubId: filterClubId }, tournament: { teams } } = this.props
    return teams.filter(team => !filterClubId || team.clubId === filterClubId)
  }
}
