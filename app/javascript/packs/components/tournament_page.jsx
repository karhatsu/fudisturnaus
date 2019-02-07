import React from 'react'
import PropTypes from 'prop-types'
import { format, parseISO } from 'date-fns'
import { addResult } from './util/util'

export default class TournamentPage extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      filtersOpen: false,
      filters: {
        ageGroupId: null,
        clubId: null,
        fieldId: null,
        groupId: null,
        teamId: null
      },
      tournament: undefined
    }
  }

  render() {
    const { tournament } = this.state
    if (!tournament) {
      return <div>Loading...</div>
    }
    const { location, startDate, groupStageMatches } = tournament
    const filtersArrow = this.state.filtersOpen ? '&#x25B2;' : '&#x25BC;'
    return (
      <div>
        <div className="Title">{tournament.name}</div>
        <div className="SubTitle">{location}, {startDate}</div>
        <div className="FiltersTitle" onClick={this.toggleFilters}>
          Rajaa otteluita
          <span className="FiltersTitle-arrow" dangerouslySetInnerHTML={{ __html: filtersArrow }}/>
        </div>
        {this.renderFilters()}
        <table className="Results">
          <thead>
            <tr>
              <th>Kello</th>
              <th>Kenttä</th>
              <th>Ottelu</th>
              <th>Tulos</th>
            </tr>
          </thead>
          <tbody>
            {groupStageMatches.map(this.renderGroupStageMatch)}
          </tbody>
        </table>
      </div>
    )
  }

  toggleFilters = () => {
    const { filtersOpen } = this.state
    this.setState({ filtersOpen: !filtersOpen })
  }

  renderFilters = () => {
    if (this.state.filtersOpen) {
      const { tournament: { ageGroups, groups, clubs, teams, fields } } = this.state
      return (
        <div className="Filters">
          {this.renderFilter('ageGroupId', ageGroups, 'Sarja')}
          {this.renderFilter('groupId', groups, 'Lohko')}
          {this.renderFilter('clubId', clubs, 'Seura')}
          {this.renderFilter('teamId', teams, 'Joukkue')}
          {this.renderFilter('fieldId', fields, 'Kenttä')}
        </div>
      )
    }
  }

  renderFilter = (key, items, defaultText) => {
    return (
      <select className="Filter" onChange={this.setFilterValue(key)}>
        <option>{defaultText}</option>
        {items.map(item => {
          const { id, name } = item
          return <option key={id} value={id}>{name}</option>
        })}
      </select>
    )
  }

  setFilterValue = key => {
    return event => {
      const filters = { ...this.state.filters, [key]: parseInt(event.target.value) }
      this.setState({ filters })
    }
  }

  isFilterMatch = groupStageMatch => {
    const { filters } = this.state
    const { ageGroupId, fieldId, groupId, homeTeam, awayTeam } = groupStageMatch
    return (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.fieldId || filters.fieldId === fieldId)
      && (!filters.groupId || filters.groupId === groupId)
      && (!filters.clubId || filters.clubId === homeTeam.clubId || filters.clubId === awayTeam.clubId)
      && (!filters.teamId || filters.teamId === homeTeam.id || filters.teamId === awayTeam.id)
  }

  renderGroupStageMatch = groupStageMatch => {
    const { id, startTime, field, homeTeam, awayTeam, homeGoals, awayGoals } = groupStageMatch
    if (this.isFilterMatch(groupStageMatch)) {
      return (
        <tr key={id}>
          <td>{format(parseISO(startTime), 'HH:mm')}</td>
          <td>{field.name}</td>
          <td>{homeTeam.name} - {awayTeam.name}</td>
          {this.renderResult(homeGoals, awayGoals)}
        </tr>
      )
    }
  }

  renderResult = (homeGoals, awayGoals) => {
    if (homeGoals || homeGoals === 0) {
      return <td>{homeGoals} - {awayGoals}</td>
    }
    return <td/>
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props
    fetch(`/api/v1/tournaments/${id}`)
      .then(response => response.json())
      .then(tournament => this.setState({ tournament }))
      .catch(console.error) // eslint-disable-line no-console
    this.subscribeToResultsChannel(id)
  }

  subscribeToResultsChannel = (tournamentId) => {
    // eslint-disable-next-line no-undef
    App.cable.subscriptions.create({
      channel: 'ResultsChannel',
      tournament_id: tournamentId
    }, {
      received: data => {
        const tournament = this.state.tournament
        const { groupStageMatchId, homeGoals, awayGoals } = data
        const groupStageMatches = addResult(tournament.groupStageMatches, groupStageMatchId, homeGoals, awayGoals)
        this.setState({ tournament: { ...tournament, groupStageMatches } })
      }
    })
  }
}
