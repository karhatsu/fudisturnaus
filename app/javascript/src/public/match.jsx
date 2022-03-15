import React from 'react'
import PropTypes from 'prop-types'
import { formatMatchTime } from '../util/date_util'
import Team from './team'

const Match = ({ clubs, fieldsCount, match, selectedClubId, selectedTeamId, tournamentDays }) => {
  const renderMatchInfo = (startTime, field, ageGroup, group) => {
    const fieldName = fieldsCount > 1 ? `${field.name}, ` : ''
    return (
      <div>
        <span className="match__start-time">{formatMatchTime(tournamentDays, startTime)}</span>
        <span className="match__details">{fieldName}{ageGroup.name}{group ? `, ${group.name}` : ''}</span>
      </div>
    )
  }

  const renderPlayoffMatchTitle = (homeTeam, awayTeam, title) => {
    if (title) {
      const text = homeTeam || awayTeam ? `${title}:` : title
      return <div className="match__playoff-title">{text}</div>
    }
  }

  const renderTeams = (homeTeam, awayTeam) => {
    if (homeTeam || awayTeam) {
      return (
        <>
          {renderTeam(homeTeam)}
          <span className="match__teams-separator">-</span>
          {renderTeam(awayTeam)}
        </>
      )
    }
  }

  const renderTeam = team => {
    if (!team) return <span>?</span>
    const selected = team.id === selectedTeamId || team.clubId === selectedClubId
    return <Team clubId={team.clubId} clubs={clubs} name={team.name} selected={selected} />
  }

  const renderResult = () => {
    const { homeGoals, awayGoals, penalties } = match
    if (homeGoals || homeGoals === 0) {
      return `${homeGoals} - ${awayGoals}${penalties ? ' rp' : ''}`
    }
  }

  const { startTime, field, homeTeam, awayTeam, title, ageGroup, group } = match
  return (
    <div className="match">
      <div className="match__row">
        {renderMatchInfo(startTime, field, ageGroup, group)}
      </div>
      <div className="match__row">
        <div className="match__teams">
          {renderPlayoffMatchTitle(homeTeam, awayTeam, title)}
          {renderTeams(homeTeam, awayTeam)}
        </div>
        <div className="match__result">{renderResult()}</div>
      </div>
    </div>
  )
}

Match.propTypes = {
  clubs: PropTypes.arrayOf(PropTypes.shape({
    logoUrl: PropTypes.string,
  })).isRequired,
  fieldsCount: PropTypes.number.isRequired,
  match: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string,
    homeTeam: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    awayTeam: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    homeGoals: PropTypes.number,
    awayGoals: PropTypes.number,
    penalties: PropTypes.bool,
    ageGroup: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    group: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  selectedClubId: PropTypes.number,
  selectedTeamId: PropTypes.number,
  tournamentDays: PropTypes.number.isRequired,
}

export default Match
