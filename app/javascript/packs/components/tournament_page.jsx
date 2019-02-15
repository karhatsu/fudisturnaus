import React from 'react'
import PropTypes from 'prop-types'

import Loading from './loading'
import Matches from './matches'
import GroupResults from './group_results'
import {addResult, formatTournamentDates, updateGroupResults} from './util/util'

export default class TournamentPage extends React.PureComponent {
  static propTypes = {
    officialAccessKey: PropTypes.string,
    showGroupTables: PropTypes.bool,
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
    const { showGroupTables } = this.props
    const { location, startDate, endDate, groupStageMatches, groups, playoffMatches } = tournament
    const filtersArrow = filtersOpen ? '&#x25B2;' : '&#x25BC;'
    return (
      <div>
        <div className="sub-title">{location}, {formatTournamentDates(startDate, endDate)}</div>
        <div className="filters-title" onClick={this.toggleFilters}>
          Rajaa otteluita
          <span className="filters-title__arrow" dangerouslySetInnerHTML={{ __html: filtersArrow }}/>
        </div>
        {this.renderFilters()}
        {this.renderMatches(groupStageMatches, 'Alkulohkojen ottelut', playoffMatches.length)}
        {showGroupTables && <div className="result-section-title">Sarjataulukot</div>}
        {showGroupTables && <div className="group-results row">{groups.map(this.renderGroup)}</div>}
        {this.renderMatches(playoffMatches, 'Jatko-ottelut', playoffMatches.length)}
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
            const {id, name} = item
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
        {showTitle && <div className="result-section-title">{title}</div>}
        <Matches
          accessKey={officialAccessKey}
          editable={!!officialAccessKey}
          fieldsCount={fields.length}
          matches={matches.filter(this.isFilterMatch)}
          onSave={this.onSave}
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

  onSave = (groupStageMatchId, homeGoals, awayGoals) => {
    const tournament = this.state.tournament
    const groupStageMatches = addResult(tournament.groupStageMatches, groupStageMatchId, homeGoals, awayGoals)
    this.setState({ tournament: { ...tournament, groupStageMatches } })
  }

  renderGroup = group => {
    const { filters, tournament: { groups } } = this.state
    return <GroupResults filters={filters} group={group} groupsCount={groups.length} key={group.id}/>
  }

  componentDidMount() {
    const { officialAccessKey, tournamentId } = this.props
    fetch(`/api/v1/tournaments/${tournamentId}`)
      .then(response => response.json())
      .then(tournament => this.setState({ tournament }))
      .catch(err => {
        console.error(err) // eslint-disable-line no-console
        this.setState({ error: true })
      })
    if (!officialAccessKey) {
      this.subscribeToResultsChannel(tournamentId)
    }
  }

  subscribeToResultsChannel = (tournamentId) => {
    // eslint-disable-next-line no-undef
    App.cable.subscriptions.create({
      channel: 'ResultsChannel',
      tournament_id: tournamentId,
    }, {
      received: data => {
        const tournament = this.state.tournament
        const { groupStageMatchId, homeGoals, awayGoals, groupId, groupResults } = data
        const groupStageMatches = addResult(tournament.groupStageMatches, groupStageMatchId, homeGoals, awayGoals)
        const groups = updateGroupResults(tournament.groups, groupId, groupResults)
        this.setState({ tournament: { ...tournament, groupStageMatches, groups } })
      },
    })
  }
}
