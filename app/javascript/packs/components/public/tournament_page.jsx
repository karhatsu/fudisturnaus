import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import Loading from '../components/loading'
import Matches from './matches'
import GroupResults from './group_results'
import { buildTournamentFromSocketData } from '../util/util'
import { formatTournamentDates } from '../util/date_util'
import Title from '../components/title'
import { fetchTournament } from './api_client'
import Filters from './filters'
import SeriesAndTeams from './series_and_teams'
import VisibilityBadge from '../tournament_management/visibility_badge'
import { visibilityTypes } from '../util/enums'
import InfoBox from './info_box'
import IframeTitle from './iframe_title'

const { onlyTitle, teams, all } = visibilityTypes

export const officialLevels = {
  none: 0,
  results: 1,
  full: 2,
}
const { none, results, full } = officialLevels

const defaultFilters = {
  ageGroupId: 0,
  clubId: 0,
  day: 0,
  fieldId: 0,
  groupId: 0,
  teamId: 0,
}

export default class TournamentPage extends React.PureComponent {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        accessKey: PropTypes.string,
      }).isRequired,
    }),
    officialLevel: PropTypes.oneOf([none, results, full]).isRequired,
    renderMatch: PropTypes.func.isRequired,
    tournamentKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }

  constructor(props) {
    super(props)
    const queryParams = queryString.parse(props.location.search)
    Object.keys(queryParams).forEach(queryParam => {
      queryParams[queryParam] = parseInt(queryParams[queryParam])
    })
    this.state = {
      error: false,
      filters: { ...defaultFilters, ...queryParams },
      tournament: undefined,
    }
  }

  render() {
    const { officialLevel } = this.props
    const { error, tournament } = this.state
    const iconLink = officialLevel === officialLevels.none ? '/' : null
    const title = tournament ? tournament.name : 'fudisturnaus.com'
    const club = tournament ? tournament.club : undefined
    return (
      <div>
        <IframeTitle />
        <Title iconLink={iconLink} loading={!tournament && !error} text={title} club={club}>
          {this.renderCancelledBadge()}
        </Title>
        {this.renderSubTitle()}
        {this.renderContent()}
      </div>
    )
  }

  renderVisibilityBadge() {
    const { tournament } = this.state
    if (tournament && !tournament.cancelled && this.props.officialLevel === officialLevels.full) {
      return <VisibilityBadge visibility={tournament.visibility}/>
    }
  }

  renderCancelledBadge() {
    const { tournament } = this.state
    if (tournament && tournament.cancelled) {
      return <div className="badge badge--0">Turnaus peruttu</div>
    }
  }

  renderContent() {
    const { error, tournament } = this.state
    if (error) {
      return <div className="message message--error">Virhe haettaessa turnauksen tietoja. Tarkasta verkkoyhteytesi ja lataa sivu uudestaan.</div>
    }
    if (!tournament) {
      return <Loading/>
    }
    switch (this.props.officialLevel) {
      case officialLevels.full:
        return this.renderFullOfficialContent()
      case officialLevels.results:
        return this.renderResultsOfficialContent()
      default:
        return this.renderPublicContent()
    }
  }

  renderFullOfficialContent() {
    const { match: { params : { accessKey } } } = this.props
    return (
      <div className="tournament-page__full-official">
        <div className="title-1">
          Turnauksen hallinta
          {this.renderVisibilityBadge()}
        </div>
        <div className="management-link"><Link to={`/official/${accessKey}/management`}>Muokkaa turnauksen asetuksia ja otteluohjelmaa</Link></div>
        <div className="title-1">Tulosten tallentaminen</div>
        {this.renderFullOfficialMatchContent()}
      </div>
    )
  }

  renderFullOfficialMatchContent() {
    if (this.state.tournament.visibility === all && this.tournamentHasMatches()) {
      return this.renderMatchContent()
    } else {
      const msg = 'Kun olet julkaissut turnauksen otteluohjelman, pääset tässä tallentamaan otteluiden tuloksia.'
      return <div className="message message--warning">{msg}</div>
    }
  }

  renderResultsOfficialContent() {
    if (this.state.tournament.visibility === all && this.tournamentHasMatches()) {
      return this.renderMatchContent()
    }
    const msg = 'Kun turnauksen otteluohjelma julkaistaan, pääset tällä sivulla tallentamaan otteluiden tuloksia.'
    return <div className="message message--warning message--full-page">{msg}</div>
  }

  renderPublicContent() {
    const { tournament } = this.state
    if (tournament.visibility === onlyTitle) {
      const msg = 'Turnauksen osallistujia ja otteluohjelmaa ei ole vielä julkaistu'
      return <div className="message message--warning message--full-page">{msg}</div>
    } else if (tournament.visibility === teams || !this.tournamentHasMatches()) {
      return <SeriesAndTeams tournament={tournament}/>
    } else {
      return this.renderMatchContent()
    }
  }

  tournamentHasMatches = () => {
    return this.state.tournament.groupStageMatches.length > 0
  }

  renderMatchContent() {
    const { filters, tournament } = this.state
    const groupStageMatches = tournament.groupStageMatches.filter(this.isFilterGroupStageMatch)
    const filteredPlayoffMatches = tournament.playoffMatches.filter(this.isFilterPlayoffMatch)
    return (
      <div>
        <Filters filters={filters} resetFilters={this.resetFilters} setFilterValue={this.setFilterValue} tournament={tournament}/>
        {this.renderMatches(groupStageMatches, 'Alkulohkojen ottelut', tournament.playoffMatches.length, true)}
        {this.renderGroupTables()}
        {this.renderMatches(filteredPlayoffMatches, 'Jatko-ottelut', filteredPlayoffMatches.length)}
        <InfoBox/>
      </div>
    )
  }

  renderSubTitle = () => {
    const { tournament } = this.state
    if (tournament) {
      const { startDate, endDate } = tournament
      return <div className="sub-title">{this.renderLocation()}, {formatTournamentDates(startDate, endDate)}</div>
    }
  }

  renderLocation = () => {
    const { tournament: { address, location } } = this.state
    const googleMapsUrl = address ? `https://www.google.com/maps/place/${address.split(' ').join('+')}` : undefined
    return googleMapsUrl ? <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="sub-title__location">{location}</a> : location
  }

  resetFilters = () => {
    this.setState({ filters: defaultFilters })
    this.props.history.push({ search: '' })
  }

  setFilterValue = key => event => {
    const filters = { ...this.state.filters, [key]: parseInt(event.target.value) }
    this.setState({ filters })
    this.props.history.push({ search: this.buildQueryParams(filters) })
  }

  buildQueryParams = filters => {
    const validFilters = {}
    Object.keys(filters).forEach(filter => {
      if (filters[filter] > 0) {
        validFilters[filter] = filters[filter]
      }
    })
    return queryString.stringify(validFilters)
  }

  renderMatches = (matches, title, showTitle, showEmptyError = false) => {
    const { officialLevel, renderMatch } = this.props
    const { filters, tournament: { clubs, days, fields, id } } = this.state
    return (
      <div>
        {showTitle ? <div className="title-2">{title}</div> : ''}
        <Matches
          clubs={clubs}
          editable={officialLevel !== officialLevels.none}
          fieldsCount={fields.length}
          matches={matches}
          renderMatch={renderMatch}
          selectedClubId={filters.clubId}
          selectedTeamId={filters.teamId}
          showEmptyError={showEmptyError}
          tournamentDays={days}
          tournamentId={id}
        />
      </div>
    )
  }

  isFilterGroupStageMatch = match => {
    const { filters } = this.state
    const { ageGroupId, day, fieldId, groupId, homeTeam, awayTeam } = match
    return (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.fieldId || filters.fieldId === fieldId)
      && (!filters.groupId || filters.groupId === groupId)
      && (!filters.clubId || filters.clubId === homeTeam.clubId || filters.clubId === awayTeam.clubId)
      && (!filters.teamId || filters.teamId === homeTeam.id || filters.teamId === awayTeam.id)
      && (!filters.day || filters.day === day)
  }

  isFilterPlayoffMatch = match => {
    const { filters } = this.state
    const { ageGroupId, day, fieldId, homeTeam, awayTeam, homeTeamOriginId, awayTeamOriginId } = match
    return (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.fieldId || filters.fieldId === fieldId)
      && (!filters.groupId || filters.groupId === homeTeamOriginId || filters.groupId === awayTeamOriginId)
      && (!filters.clubId || (homeTeam && filters.clubId === homeTeam.clubId) || (awayTeam && filters.clubId === awayTeam.clubId))
      && (!filters.teamId || (homeTeam && filters.teamId === homeTeam.id) || (awayTeam && filters.teamId === awayTeam.id))
      && (!filters.day || filters.day === day)
  }

  renderGroupTables = () => {
    const { filters, tournament: { calculateGroupTables, groups } } = this.state
    const filteredGroups = groups.filter(this.isFilterGroup)
    if (calculateGroupTables && filteredGroups.length && !filters.day) {
      return (
        <React.Fragment>
          <div className="title-2">Sarjataulukot</div>
          <div className="group-results row">{filteredGroups.map(group => this.renderGroup(group, filteredGroups.length))}</div>
        </React.Fragment>
      )
    }
  }

  renderGroup = (group, groupsCount) => {
    const { filters, tournament: { clubs } } = this.state
    return <GroupResults clubs={clubs} filters={filters} group={group} groupsCount={groupsCount} key={group.id}/>
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
    const { tournamentKey } = this.props
    fetchTournament(tournamentKey, (err, tournament) => {
      if (tournament) {
        this.setState({ tournament })
        this.subscribeToResultsChannel(tournament.id)
      } else if (err && !this.state.tournament) {
        this.setState({ error: true })
      }
    })
  }

  subscribeToResultsChannel = tournamentId => {
    // eslint-disable-next-line no-undef
    App.cable.subscriptions.create({
      channel: 'ResultsChannel',
      tournament_id: tournamentId,
    }, {
      received: data => {
        const tournament = buildTournamentFromSocketData(this.state.tournament, data)
        this.setState({ tournament })
      },
    })
  }
}
