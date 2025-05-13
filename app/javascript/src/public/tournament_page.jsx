import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Link } from 'react-router'
import queryString from 'query-string'
import ReactMarkdown from 'react-markdown'

import Loading from '../components/loading'
import Matches from './matches'
import GroupResults from './group_results'
import Title from '../components/title'
import Filters, { defaultFilters } from './filters'
import SeriesAndTeams from './series_and_teams'
import VisibilityBadge from '../tournament_management/visibility_badge'
import { visibilityTypes } from '../util/enums'
import Hero from './hero'
import IframeTitle from './iframe_title'
import Message from '../components/message'
import useTournamentFetching from '../util/use_tournament_fetching'
import CancelledBadge from './cancelled_badge'
import TournamentSubTitle from './tournament_sub_title'

const { onlyTitle, teams, all } = visibilityTypes

export const officialLevels = {
  none: 0,
  results: 1,
  full: 2,
}
const { none, results, full } = officialLevels

const kontuSponsors = [
  { href: 'https://daddygreens.fi', img: 'Daddy_Greens_logo_black_bg_RGB.png' },
  { href: 'https://www.subway.fi/fi/ravintolat/helsinki/helsinki-kontulankaari', img: 'Subway-logo.png' },
  { href: 'https://www.intersport.fi/fi/kauppa/helsinki-easton', img: 'intersport.jpg', className: 'wide' },
  { href: 'https://www.k-ruoka.fi/kauppa/k-market-kivikko', img: 'K-market-Kivikko.png' },
  { href: 'https://getra.fi/', img: 'Getra-Blauw.png' },
  { href: 'https://www.laattabest.com/', img: 'LaattaBest.jpeg' },
  { href: 'https://www.ahlsell.fi/', img: 'ahlsell.jpeg', className: 'wide' }
]

const TournamentPage = ({ officialLevel, renderMatch, tournamentKey }) => {
  const { accessKey } = useParams()
  const { search } = useLocation()
  const navigate = useNavigate()
  const { error, tournament } = useTournamentFetching(tournamentKey)
  const [filters, setFilters] = useState(defaultFilters)

  const isFilterGroup = useCallback(group => {
    const { ageGroupId, id: groupId, results } = group
    return results.length
      && (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.groupId || filters.groupId === groupId)
      && (!filters.clubId || results.findIndex(team => team.clubId === filters.clubId) !== -1)
      && (!filters.teamId || results.findIndex(team => team.teamId === filters.teamId) !== -1)
  }, [filters])

  const filteredGroups = useMemo(() => {
    return tournament?.groups
      .filter(isFilterGroup)
      .filter(group => officialLevel !== officialLevels.none || !group.ageGroup.hideGroupTables)
      .sort((a, b) => {
        if (a.ageGroup.name !== b.ageGroup.name) return a.ageGroup.name.localeCompare(b.ageGroup.name)
        return a.name.localeCompare(b.name)
      })
  }, [tournament, isFilterGroup, officialLevel])

  const goToGroupTables = useCallback(event => {
    event.preventDefault()
    document.getElementById('group-tables-title')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const queryParams = queryString.parse(search)
    Object.keys(queryParams).forEach(queryParam => {
      queryParams[queryParam] = defaultFilters[queryParam] === 0 ? parseInt(queryParams[queryParam]) : queryParams[queryParam]
    })
    setFilters({ ...defaultFilters, ...queryParams })
  }, [search])

  const renderVisibilityBadge = () => {
    if (tournament && !tournament.cancelled && officialLevel === officialLevels.full) {
      return <VisibilityBadge visibility={tournament.visibility}/>
    }
  }

  const showTournamentInfo = () => tournament?.info && officialLevel === officialLevels.none

  const renderTournamentInfo = () => (
    <div>
      <div className="title-2">Turnausinfo</div>
      <div className="info-box info-box--tournament-info">
        <ReactMarkdown>{tournament.info}</ReactMarkdown>
      </div>
    </div>
  )

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
      return (
        <div>
          <div className="title-2">Otteluohjelma</div>
          <Message type="warning" fullPage={true}>Turnauksen osallistujia ja otteluohjelmaa ei ole vielä julkaistu</Message>
        </div>
      )
    } else if (tournament.visibility === teams || !tournamentHasMatches()) {
      return <SeriesAndTeams tournament={tournament}/>
    } else {
      return (
        <>
          {renderMatchContent()}
          <div className="title-2">fudisturnaus.com</div>
          <Hero />
        </>
      )
    }
  }

  const tournamentHasMatches = () => {
    return tournament.groupStageMatches.length > 0
  }

  const renderSponsors = () => {
    if (officialLevel === officialLevels.none && tournament && tournament.slug === 'fc-kontun-touko-cup') {
      return (
        <>
          <div className="title-2">Turnausta tukemassa</div>
          <div className="sponsors">
            {kontuSponsors.map(({ href, img, className }) => (
              <a key={img} href={href} target="_blank" rel="noopener noreferrer">
                <img alt="Tuokko" src={`/sponsors/${img}`} className={className} />
              </a>
            ))}
          </div>
        </>
      )
    }
  }

  const renderMatchContent = () => {
    const groupStageMatches = tournament.groupStageMatches.filter(isFilterGroupStageMatch)
    const filteredPlayoffMatches = tournament.playoffMatches.filter(isFilterPlayoffMatch)
    const onGoToGroupTables = showGroupTables(filteredGroups) ? goToGroupTables : undefined
    return (
      <div>
        {showTournamentInfo() && <div className="title-2">Ottelut</div>}
        <Filters
          filters={filters}
          onGoToGroupTables={onGoToGroupTables}
          resetFilters={resetFilters}
          setFilterValue={setFilterValue}
          tournament={tournament}
        />
        {renderMatches(groupStageMatches, 'Alkulohkojen ottelut', tournament.playoffMatches.length, true)}
        {renderGroupTables()}
        {renderMatches(filteredPlayoffMatches, 'Jatko-ottelut', filteredPlayoffMatches.length)}
        {renderPlayoffGroupTables()}
        {renderSponsors()}
      </div>
    )
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    navigate({ search: '' })
  }

  const setFilterValue = key => event => {
    const value = key === 'date' ? event.target.value : parseInt(event.target.value)
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    navigate({ search: buildQueryParams(newFilters) })
  }

  const buildQueryParams = filters => {
    const validFilters = {}
    Object.keys(filters).forEach(filter => {
      if (filters[filter] !== defaultFilters[filter]) {
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
          ageGroups={tournament.ageGroups}
          clubs={clubs}
          fieldsCount={fields.length}
          groups={tournament.groups}
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
    const { ageGroupId, date, fieldId, groupId, homeTeam, awayTeam } = match
    return (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.fieldId || filters.fieldId === fieldId)
      && (!filters.groupId || filters.groupId === groupId)
      && (!filters.clubId || filters.clubId === homeTeam.clubId || filters.clubId === awayTeam.clubId)
      && (!filters.teamId || filters.teamId === homeTeam.id || filters.teamId === awayTeam.id)
      && (!filters.date || filters.date === date)
  }

  const isFilterPlayoffMatch = match => {
    const { ageGroupId, date, fieldId, homeTeam, awayTeam, homeTeamOriginId, awayTeamOriginId } = match
    return (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.fieldId || filters.fieldId === fieldId)
      && (!filters.groupId || filters.groupId === homeTeamOriginId || filters.groupId === awayTeamOriginId)
      && (!filters.clubId || (homeTeam && filters.clubId === homeTeam.clubId) || (awayTeam && filters.clubId === awayTeam.clubId))
      && (!filters.teamId || (homeTeam && filters.teamId === homeTeam.id) || (awayTeam && filters.teamId === awayTeam.id))
      && (!filters.date || filters.date === date)
  }

  const showGroupTables = groups => {
    const { calculateGroupTables } = tournament
    return calculateGroupTables && groups.length && !filters.date && !filters.fieldId
  }

  const renderGroupTables = () => {
    if (showGroupTables(filteredGroups)) {
      return (
        <>
          <div className="title-2" id="group-tables-title">Sarjataulukot</div>
          <div className={`group-results group-results--${filteredGroups.length} row`}>
            {filteredGroups.map(group => renderGroup(group, filteredGroups.length, true))}
          </div>
        </>
      )
    }
  }

  const renderPlayoffGroupTables = () => {
    const filteredGroups = tournament.playoffGroups.filter(isFilterGroup)
    if (showGroupTables(filteredGroups)){
      return (
        <>
          <div className="title-2">Jatkolohkot</div>
          <div className={`group-results group-results--${filteredGroups.length} row`}>
            {filteredGroups.map(group => renderGroup(group, filteredGroups.length, false))}
          </div>
        </>
      )
    }
  }

  const renderGroup = (group, groupsCount, showLottery) => {
    return (
      <GroupResults
        ageGroups={tournament.ageGroups}
        clubs={tournament.clubs}
        filters={filters}
        group={group}
        groups={tournament.groups}
        visibleGroupsCount={groupsCount}
        showLottery={showLottery}
        key={group.id}
      />
    )
  }

  const iconLink = officialLevel === officialLevels.none ? '/' : null
  const title = tournament ? tournament.name : 'fudisturnaus.com'
  const club = tournament ? tournament.club : undefined
  return (
    <div>
      <IframeTitle />
      <Title iconLink={iconLink} loading={!tournament && !error} text={title} club={club} tournament={tournament}>
        <CancelledBadge tournament={tournament} />
      </Title>
      <TournamentSubTitle tournament={tournament} />
      {showTournamentInfo() && renderTournamentInfo()}
      {renderContent()}
    </div>
  )
}

TournamentPage.propTypes = {
  officialLevel: PropTypes.oneOf([none, results, full]).isRequired,
  renderMatch: PropTypes.func.isRequired,
  tournamentKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}

export default TournamentPage
