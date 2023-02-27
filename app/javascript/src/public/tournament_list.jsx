import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { addDays, endOfDay, endOfWeek, isBefore, isSameDay, parseISO } from 'date-fns'

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
  const { buildLink, search, setSearch, showInfo, title, tournaments, tournamentsError } = props

  const renderTournament = useCallback(tournament => {
    const { id } = tournament
    return (
      <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={id}>
        <TournamentLinkBox to={buildLink(tournament)} tournament={tournament}/>
      </div>
    )
  }, [buildLink])

  const matchCaseInsensitive = useCallback(text => new RegExp(search.trim(), 'i').test(text), [search])

  const filterTournaments = useCallback(() => {
    if (!search) return tournaments
    return tournaments.filter(tournament => {
      const { name, location, club } = tournament
      return matchCaseInsensitive(name) || matchCaseInsensitive(location) || (club && matchCaseInsensitive(club.name))
    })
  }, [search, tournaments, matchCaseInsensitive])

  const groupTournaments = useCallback(tournaments => {
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
  }, [])

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

  const renderSearchBox = () => {
    return (
      <div className="form form--vertical form--search">
        <div className="form__field form__field--long">
          <div className="label">Etsi turnaus</div>
          <input type="text" placeholder="Turnauksen nimi, paikka tai järjestäjä" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (tournamentsError) {
      return <Message type="error">Virhe haettaessa turnauksia. Tarkasta verkkoyhteytesi ja lataa sivu uudestaan.</Message>
    } else if (!tournaments) {
      return <Loading/>
    } else if (!tournaments.length) {
      return <Message type="error">Ei turnauksia</Message>
    }
    const groups = groupTournaments(filterTournaments())
    const laterTitle = !groups.today.length && !groups.thisWeek.length && !groups.nextWeek.length
      ? 'Tulevat turnaukset'
      : 'Turnaukset myöhemmin'
    return (
      <>
        {setSearch && renderSearchBox()}
        <div className="tournament-links">
          {renderTournaments(groups.today, 'Turnaukset tänään')}
          {renderTournaments(groups.thisWeek, 'Turnaukset tällä viikolla')}
          {renderTournaments(groups.nextWeek, 'Turnaukset ensi viikolla')}
          {renderTournaments(groups.later, laterTitle)}
          {renderTournaments(groups.past, 'Päättyneet turnaukset')}
        </div>
      </>
    )
  }

  return (
    <div>
      <Title loading={!tournamentsError && !tournaments} text={title}/>
      {showInfo && <InfoBox/>}
      {renderContent()}
      {props.children}
    </div>
  )
}

TournamentList.propTypes = {
  buildLink: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
  search: PropTypes.string,
  setSearch: PropTypes.func,
  showInfo: PropTypes.bool,
  title: PropTypes.string.isRequired,
  tournaments: PropTypes.array,
  tournamentsError: PropTypes.bool.isRequired,
}

export default TournamentList
