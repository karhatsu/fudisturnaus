import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { addDays, endOfDay, endOfWeek, isBefore, isSameDay, parseISO } from 'date-fns'

import { fetchTournaments } from './api_client'
import Loading from '../components/loading'
import Title from '../components/title'
import TournamentLinkBox from '../components/tournament_link_box'
import InfoBox from './info_box'
import Message from '../components/message'

const sortByAscendingDate = (a, b) => {
  const timeCompare = a.startDate.localeCompare(b.startDate)
  if (timeCompare !== 0) {
    return timeCompare
  }
  return a.name.localeCompare(b.name)
}

const TournamentList = props => {
  const { buildLink, query, showInfo, showTestTournaments, title } = props
  const [error, setError] = useState(false)
  const [tournaments, setTournaments] = useState(undefined)

  useEffect(() => {
    fetchTournaments(query || {}, (err, data) => {
      if (err) {
        setError(true)
      } else {
        const tournaments = showTestTournaments ? data : data.filter(t => !t.test)
        setTournaments(tournaments)
      }
    })
  }, [query, showTestTournaments])

  const renderTournament = useCallback(tournament => {
    const { id } = tournament
    return (
      <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={id}>
        <TournamentLinkBox to={buildLink(tournament)} tournament={tournament}/>
      </div>
    )
  }, [buildLink])

  const groupTournaments = () => {
    const groups = { today: [], thisWeek: [], nextWeek: [], later: [], past: [] }
    tournaments.forEach(tournament => {
      const startDate = parseISO(tournament.startDate)
      const endDate = parseISO(tournament.endDate)
      if (isBefore(endOfDay(endDate), new Date())) {
        groups.past.push(tournament)
      } else if (isSameDay(startDate, new Date()) || isSameDay(endDate, new Date())) {
        groups.today.push(tournament)
      } else if (isBefore(startDate, endOfWeek(new Date(), { weekStartsOn: 1 }))) {
        groups.thisWeek.push(tournament)
      } else if (isBefore(startDate, endOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }))) {
        groups.nextWeek.push(tournament)
      } else {
        groups.later.push(tournament)
      }
    })
    groups.thisWeek.sort(sortByAscendingDate)
    groups.nextWeek.sort(sortByAscendingDate)
    groups.later.sort(sortByAscendingDate)
    return groups
  }

  const renderTournaments = (tournaments, title) => {
    if (tournaments.length) {
      return (
        <>
          <div className="title-2">{title}</div>
          <div className="row">
            {tournaments.map(renderTournament)}
          </div>
        </>
      )
    }
  }

  const renderContent = () => {
    if (error) {
      return <Message type="error">Virhe haettaessa turnauksia. Tarkasta verkkoyhteytesi ja lataa sivu uudestaan.</Message>
    } else if (!tournaments) {
      return <Loading/>
    } else if (!tournaments.length) {
      return <Message type="error">Ei turnauksia</Message>
    }
    const groups = groupTournaments()
    const laterTitle = !groups.today.length && !groups.thisWeek.length && !groups.nextWeek.length
      ? 'Tulevat turnaukset'
      : 'Turnaukset myöhemmin'
    return (
      <div className="tournament-links">
        {renderTournaments(groups.today, 'Turnaukset tänään')}
        {renderTournaments(groups.thisWeek, 'Turnaukset tällä viikolla')}
        {renderTournaments(groups.nextWeek, 'Turnaukset ensi viikolla')}
        {renderTournaments(groups.later, laterTitle)}
        {renderTournaments(groups.past, 'Päättyneet turnaukset')}
      </div>
    )
  }

  return (
    <div>
      <Title loading={!error && !tournaments} text={title}/>
      {showInfo && <InfoBox/>}
      {renderContent()}
      {props.children}
    </div>
  )
}

TournamentList.propTypes = {
  buildLink: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
  showInfo: PropTypes.bool,
  showTestTournaments: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  query: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

export default TournamentList
