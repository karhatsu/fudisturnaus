import React from 'react'
import PropTypes from 'prop-types'

import Loading from './loading'
import GroupStageMatches from './group_stage_matches'
import { addResult, formatTournamentDates } from './util/util'

export default class TournamentPage extends React.PureComponent {
  static propTypes = {
    officialAccessKey: PropTypes.string,
    tournamentId: PropTypes.number.isRequired,
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
    return (
      <div>
        <div className="title">{tournament ? tournament.name : 'fudisturnaus.com'}</div>
        {tournament ? this.renderContent() : <Loading/>}
      </div>
    )
  }

  renderContent() {
    const { officialAccessKey } = this.props
    const { tournament } = this.state
    const { location, startDate, endDate, groupStageMatches } = tournament
    const filtersArrow = this.state.filtersOpen ? '&#x25B2;' : '&#x25BC;'
    return (
      <div>
        <div className="sub-title">{location}, {formatTournamentDates(startDate, endDate)}</div>
        <div className="filters-title" onClick={this.toggleFilters}>
          Rajaa otteluita
          <span className="filters-title__arrow" dangerouslySetInnerHTML={{ __html: filtersArrow }}/>
        </div>
        {this.renderFilters()}
        <GroupStageMatches
          accessKey={officialAccessKey}
          editable={!!officialAccessKey}
          groupStageMatches={groupStageMatches.filter(this.isFilterMatch)}
          onSave={this.onSave}
        />
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
        <div className="filters">
          <div className="row">
            {this.renderFilter('ageGroupId', ageGroups, 'Sarja')}
            {this.renderFilter('groupId', groups, 'Lohko')}
            {this.renderFilter('clubId', clubs, 'Seura')}
            {this.renderFilter('teamId', teams, 'Joukkue')}
            {this.renderFilter('fieldId', fields, 'Kenttä')}
          </div>
        </div>
      )
    }
  }

  renderFilter = (key, items, defaultText) => {
    if (items.length > 1) {
      return (
        <div className="col-xs-6 col-sm-4 col-md-2">
          <select className="filter" onChange={this.setFilterValue(key)}>
            <option>{defaultText}</option>
            {items.map(item => {
              const {id, name} = item
              return <option key={id} value={id}>{name}</option>
            })}
          </select>
        </div>
      )
    }
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

  onSave = (groupStageMatchId, homeGoals, awayGoals) => {
    const tournament = this.state.tournament
    const groupStageMatches = addResult(tournament.groupStageMatches, groupStageMatchId, homeGoals, awayGoals)
    this.setState({ tournament: { ...tournament, groupStageMatches } })
  }

  componentDidMount() {
    const { officialAccessKey, tournamentId } = this.props
    fetch(`/api/v1/tournaments/${tournamentId}`)
      .then(response => response.json())
      .then(tournament => this.setState({ tournament }))
      .catch(console.error) // eslint-disable-line no-console
    if (!officialAccessKey) {
      this.subscribeToResultsChannel(tournamentId)
    }
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
