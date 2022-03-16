import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import consumer from '../../channels/consumer'
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
import Message from '../components/message'

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

const TournamentPage = ({ officialLevel, renderMatch, tournamentKey }) => {
  const { accessKey } = useParams()
  const { search } = useLocation()
  const history = useHistory()
  const [error, setError] = useState(false)
  const [tournament, setTournament] = useState()
  const [subscribed, setSubscribed] = useState(false)
  const [socketData, setSocketData] = useState()
  const [filters, setFilters] = useState(defaultFilters)

  const fetchTournamentData = useCallback(() => {
    fetchTournament(tournamentKey, (err, tournament) => {
      if (tournament) {
        setTournament(tournament)
      } else if (err && !tournament) {
        setError(true)
      }
    })
  }, [tournamentKey])

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      fetchTournamentData()
    }
  }, [fetchTournamentData])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    fetchTournamentData()
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchTournamentData, handleVisibilityChange])

  useEffect(() => {
    if (tournament && !subscribed) {
      consumer.subscriptions.create({ channel: 'ResultsChannel', tournament_id: tournament.id }, { received: data => setSocketData(data) })
      setSubscribed(true)
    }
  }, [tournament, subscribed])

  useEffect(() => {
    if (socketData) {
      const newTournament = buildTournamentFromSocketData(tournament, socketData)
      setSocketData()
      setTournament(newTournament)
    }
  }, [tournament, socketData])

  useEffect(() => {
    const queryParams = queryString.parse(search)
    Object.keys(queryParams).forEach(queryParam => {
      queryParams[queryParam] = parseInt(queryParams[queryParam])
    })
    setFilters({ ...defaultFilters, ...queryParams })
  }, [search])

  const renderVisibilityBadge = () => {
    if (tournament && !tournament.cancelled && officialLevel === officialLevels.full) {
      return <VisibilityBadge visibility={tournament.visibility}/>
    }
  }

  const renderCancelledBadge = () => {
    if (tournament && tournament.cancelled) {
      return <div className="badge badge--0">Turnaus peruttu</div>
    }
  }

  const renderContent = () => {
    if (error) {
      return <Message type="error">Virhe haettaessa turnauksen tietoja. Tarkasta verkkoyhteytesi ja lataa sivu uudestaan.</Message>
    }
    if (!tournament) {
      return <Loading/>
    }
    switch (officialLevel) {
      case officialLevels.full:
        return renderFullOfficialContent()
      case officialLevels.results:
        return renderResultsOfficialContent()
      default:
        return renderPublicContent()
    }
  }

  const renderFullOfficialContent = () => {
    return (
      <div className="tournament-page__full-official">
        <div className="title-1">
          Turnauksen hallinta
          {renderVisibilityBadge()}
        </div>
        <div className="management-link"><Link to={`/official/${accessKey}/management`}>Muokkaa turnauksen asetuksia ja otteluohjelmaa</Link></div>
        <div className="title-1">Tulosten tallentaminen</div>
        {renderFullOfficialMatchContent()}
      </div>
    )
  }

  const renderFullOfficialMatchContent = () => {
    if (tournament.visibility === all && tournamentHasMatches()) {
      return renderMatchContent()
    } else {
      const msg = 'Kun olet julkaissut turnauksen otteluohjelman, pääset tässä tallentamaan otteluiden tuloksia.'
      return <Message type="warning">{msg}</Message>
    }
  }

  const renderResultsOfficialContent = () => {
    if (tournament.visibility === all && tournamentHasMatches()) {
      return renderMatchContent()
    }
    const msg = 'Kun turnauksen otteluohjelma julkaistaan, pääset tällä sivulla tallentamaan otteluiden tuloksia.'
    return <Message type="warning" fullPage={true}>{msg}</Message>
  }

  const renderPublicContent = () => {
    if (tournament.visibility === onlyTitle) {
      const msg = 'Turnauksen osallistujia ja otteluohjelmaa ei ole vielä julkaistu'
      return <Message type="warning" fullPage={true}>{msg}</Message>
    } else if (tournament.visibility === teams || !tournamentHasMatches()) {
      return <SeriesAndTeams tournament={tournament}/>
    } else {
      return renderMatchContent()
    }
  }

  const tournamentHasMatches = () => {
    return tournament.groupStageMatches.length > 0
  }

  const renderMatchContent = () => {
    const groupStageMatches = tournament.groupStageMatches.filter(isFilterGroupStageMatch)
    const filteredPlayoffMatches = tournament.playoffMatches.filter(isFilterPlayoffMatch)
    return (
      <div>
        <Filters filters={filters} resetFilters={resetFilters} setFilterValue={setFilterValue} tournament={tournament}/>
        {renderMatches(groupStageMatches, 'Alkulohkojen ottelut', tournament.playoffMatches.length, true)}
        {renderGroupTables()}
        {renderMatches(filteredPlayoffMatches, 'Jatko-ottelut', filteredPlayoffMatches.length)}
        {renderPlayoffGroupTables()}
        <InfoBox/>
      </div>
    )
  }

  const renderSubTitle = () => {
    if (tournament) {
      const { startDate, endDate } = tournament
      return <div className="sub-title">{renderLocation()}, {formatTournamentDates(startDate, endDate)}</div>
    }
  }

  const renderLocation = () => {
    const { address, location } = tournament
    const googleMapsUrl = address ? `https://www.google.com/maps/place/${address.split(' ').join('+')}` : undefined
    return googleMapsUrl ? <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="sub-title__location">{location}</a> : location
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    history.push({ search: '' })
  }

  const setFilterValue = key => event => {
    const newFilters = { ...filters, [key]: parseInt(event.target.value) }
    setFilters(newFilters)
    history.push({ search: buildQueryParams(newFilters) })
  }

  const buildQueryParams = filters => {
    const validFilters = {}
    Object.keys(filters).forEach(filter => {
      if (filters[filter] > 0) {
        validFilters[filter] = filters[filter]
      }
    })
    return queryString.stringify(validFilters)
  }

  const renderMatches = (matches, title, showTitle, showEmptyError = false) => {
    const { clubs, days, fields, id } = tournament
    return (
      <div>
        {showTitle ? <div className="title-2">{title}</div> : ''}
        <Matches
          clubs={clubs}
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

  const isFilterGroupStageMatch = match => {
    const { ageGroupId, day, fieldId, groupId, homeTeam, awayTeam } = match
    return (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.fieldId || filters.fieldId === fieldId)
      && (!filters.groupId || filters.groupId === groupId)
      && (!filters.clubId || filters.clubId === homeTeam.clubId || filters.clubId === awayTeam.clubId)
      && (!filters.teamId || filters.teamId === homeTeam.id || filters.teamId === awayTeam.id)
      && (!filters.day || filters.day === day)
  }

  const isFilterPlayoffMatch = match => {
    const { ageGroupId, day, fieldId, homeTeam, awayTeam, homeTeamOriginId, awayTeamOriginId } = match
    return (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.fieldId || filters.fieldId === fieldId)
      && (!filters.groupId || filters.groupId === homeTeamOriginId || filters.groupId === awayTeamOriginId)
      && (!filters.clubId || (homeTeam && filters.clubId === homeTeam.clubId) || (awayTeam && filters.clubId === awayTeam.clubId))
      && (!filters.teamId || (homeTeam && filters.teamId === homeTeam.id) || (awayTeam && filters.teamId === awayTeam.id))
      && (!filters.day || filters.day === day)
  }

  const renderGroupTables = () => {
    const { calculateGroupTables, groups } = tournament
    const filteredGroups = groups.filter(isFilterGroup)
    if (calculateGroupTables && filteredGroups.length && !filters.day) {
      return (
        <React.Fragment>
          <div className="title-2">Sarjataulukot</div>
          <div className="group-results row">{filteredGroups.map(group => renderGroup(group, filteredGroups.length))}</div>
        </React.Fragment>
      )
    }
  }

  const renderPlayoffGroupTables = () => {
    const { calculateGroupTables, playoffGroups } = tournament
    const filteredGroups = playoffGroups.filter(isFilterGroup)
    if (calculateGroupTables && filteredGroups.length && !filters.day) {
      return (
        <>
          <div className="title-2">Jatkolohkot</div>
          <div className="group-results row">{filteredGroups.map(group => renderGroup(group, filteredGroups.length))}</div>
        </>
      )
    }
  }

  const renderGroup = (group, groupsCount) => {
    return <GroupResults clubs={tournament.clubs} filters={filters} group={group} groupsCount={groupsCount} key={group.id}/>
  }

  const isFilterGroup = group => {
    const { ageGroupId, id: groupId, results } = group
    return results.length
      && (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.groupId || filters.groupId === groupId)
      && (!filters.clubId || results.findIndex(team => team.clubId === filters.clubId) !== -1)
      && (!filters.teamId || results.findIndex(team => team.teamId === filters.teamId) !== -1)
  }

  const iconLink = officialLevel === officialLevels.none ? '/' : null
  const title = tournament ? tournament.name : 'fudisturnaus.com'
  const club = tournament ? tournament.club : undefined
  return (
    <div>
      <IframeTitle />
      <Title iconLink={iconLink} loading={!tournament && !error} text={title} club={club}>
        {renderCancelledBadge()}
      </Title>
      {renderSubTitle()}
      {renderContent()}
    </div>
  )
}

TournamentPage.propTypes = {
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

export default TournamentPage
