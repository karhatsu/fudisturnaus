import React from 'react'
import PropTypes from 'prop-types'

import Loading from './loading'
import Matches from './matches'
import GroupResults from './group_results'
import { addResult, formatTournamentDates, updateGroupResults, updatePlayoffMatches } from './util/util'
import { matchTypes } from './util/enums'

export default class TournamentPage extends React.PureComponent {
  static propTypes = {
    officialAccessKey: PropTypes.string,
    tournamentId: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      error: false,
      filtersOpen: false,
      filters: {
        ageGroupId: null,
        clubId: null,
        fieldId: null,
        groupId: null,
        teamId: null,
      },
      tournament: undefined,
    }
  }

  render() {
    const { tournament } = this.state
    return (
      <div>
        <div className="title">{tournament ? tournament.name : 'fudisturnaus.com'}</div>
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    const { error, filtersOpen, tournament } = this.state
    if (error) {
      return <div className="message message--error">Virhe haettaessa turnauksen tietoja. Tarkasta verkkoyhteytesi ja lataa sivu uudestaan.</div>
    }
    if (!tournament) {
      return <Loading/>
    }
    const { location, startDate, endDate, playoffMatches } = tournament
    const filtersArrow = filtersOpen ? '&#x25B2;' : '&#x25BC;'
    const groupStageMatches = tournament.groupStageMatches.filter(this.isFilterMatch)
    const filteredPlayoffMatches = playoffMatches.filter(this.isFilterMatch)
    return (
      <div>
        <div className="sub-title">{location}, {formatTournamentDates(startDate, endDate)}</div>
        <div className="filters-title" onClick={this.toggleFilters}>
          Rajaa otteluita
          <span className="filters-title__arrow" dangerouslySetInnerHTML={{ __html: filtersArrow }}/>
        </div>
        {this.renderFilters()}
        {this.renderMatches(groupStageMatches, 'Alkulohkojen ottelut', playoffMatches.length)}
        {this.renderGroupTables()}
        {this.renderMatches(filteredPlayoffMatches, 'Jatko-ottelut', filteredPlayoffMatches.length)}
      </div>
    )
  }

  toggleFilters = () => {
    const { filtersOpen } = this.state
    this.setState({ filtersOpen: !filtersOpen })
  }

  renderFilters = () => {
    const { filters: { ageGroupId: filterAgeGroupId, clubId: filterClubId }, tournament: { ageGroups, groups, clubs, teams, fields } } = this.state
    const classes = ['filters']
    if (!this.state.filtersOpen) {
      classes.push('filters--closed')
    }
    return (
      <div className={classes.join(' ')}>
        {this.renderFilter('ageGroupId', ageGroups, 'Sarja')}
        {this.renderFilter('groupId', groups.filter(group => !filterAgeGroupId || group.ageGroupId === filterAgeGroupId), 'Lohko')}
        {this.renderFilter('clubId', clubs, 'Seura')}
        {this.renderFilter('teamId', teams.filter(team => !filterClubId || team.clubId === filterClubId), 'Joukkue')}
        {this.renderFilter('fieldId', fields, 'Kenttä')}
      </div>
    )
  }

  renderFilter = (key, items, defaultText) => {
    if (items.length > 1) {
      return (
        <select className="filter" onChange={this.setFilterValue(key)}>
          <option>{defaultText}</option>
          {items.map(item => {
            const { id, name } = item
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
      )
    }
  }

  setFilterValue = key => {
    return event => {
      const filters = { ...this.state.filters, [key]: parseInt(event.target.value) }
      this.setState({ filters })
    }
  }

  renderMatches = (matches, title, showTitle) => {
    const { officialAccessKey } = this.props
    const { filters, tournament: { fields } } = this.state
    return (
      <div>
        {showTitle ? <div className="result-section-title">{title}</div> : ''}
        <Matches
          accessKey={officialAccessKey}
          editable={!!officialAccessKey}
          fieldsCount={fields.length}
          matches={matches}
          selectedClubId={filters.clubId}
          selectedTeamId={filters.teamId}
        />
      </div>
    )
  }

  isFilterMatch = match => {
    const { filters } = this.state
    const { ageGroupId, fieldId, groupId, homeTeam, awayTeam } = match
    return (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.fieldId || filters.fieldId === fieldId)
      && (!filters.groupId || filters.groupId === groupId)
      && (!filters.clubId || (homeTeam && filters.clubId === homeTeam.clubId) || (awayTeam && filters.clubId === awayTeam.clubId))
      && (!filters.teamId || (homeTeam && filters.teamId === homeTeam.id) || (awayTeam && filters.teamId === awayTeam.id))
  }

  renderGroupTables = () => {
    const { tournament: { calculateGroupTables, groups } } = this.state
    const filteredGroups = groups.filter(this.isFilterGroup)
    if (calculateGroupTables && filteredGroups.length) {
      return (
        <React.Fragment>
          <div className="result-section-title">Sarjataulukot</div>
          <div className="group-results row">{filteredGroups.map(this.renderGroup)}</div>
        </React.Fragment>
      )
    }
  }

  renderGroup = group => {
    const { filters, tournament: { groups } } = this.state
    return <GroupResults filters={filters} group={group} groupsCount={groups.length} key={group.id}/>
  }

  isFilterGroup = group => {
    const { filters } = this.state
    const { ageGroupId, id: groupId, teams, results } = group
    return results.length
      && (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.groupId || filters.groupId === groupId)
      && (!filters.clubId || teams.findIndex(team => team.clubId === filters.clubId) !== -1)
      && (!filters.teamId || teams.findIndex(team => team.id === filters.teamId) !== -1)
  }

  componentDidMount() {
    this.fetchTournamentData()
    this.subscribeToResultsChannel()
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }

  handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.fetchTournamentData()
    }
  }

  fetchTournamentData = () => {
    const { tournamentId } = this.props
    fetch(`/api/v1/tournaments/${tournamentId}`)
      .then(response => response.json())
      .then(tournament => this.setState({ tournament }))
      .catch(err => {
        console.error(err) // eslint-disable-line no-console
        if (!this.state.tournament) {
          this.setState({ error: true })
        }
      })
  }

  subscribeToResultsChannel = () => {
    const { tournamentId } = this.props
    // eslint-disable-next-line no-undef
    App.cable.subscriptions.create({
      channel: 'ResultsChannel',
      tournament_id: tournamentId,
    }, {
      received: data => {
        const tournament = this.state.tournament
        const { matchId, type, homeGoals, awayGoals, penalties, groupId, groupResults } = data
        if (type === matchTypes.playoff) {
          let playoffMatches = addResult(tournament.playoffMatches, matchId, homeGoals, awayGoals, penalties)
          playoffMatches = updatePlayoffMatches(playoffMatches, data.playoffMatches)
          this.setState({ tournament: { ...tournament, playoffMatches } })
        } else {
          const groupStageMatches = addResult(tournament.groupStageMatches, matchId, homeGoals, awayGoals)
          const groups = updateGroupResults(tournament.groups, groupId, groupResults)
          const playoffMatches = updatePlayoffMatches(tournament.playoffMatches, data.playoffMatches)
          this.setState({ tournament: { ...tournament, groupStageMatches, groups, playoffMatches } })
        }
      },
    })
  }
}
