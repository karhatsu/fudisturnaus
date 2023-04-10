import React from 'react'
import PropTypes from 'prop-types'
import { formatMatchTime } from '../util/date_util'
import Team from './team'
import { buildGroupTitle } from '../util/util'

const Match = ({ ageGroups, clubs, fieldsCount, groups, match, selectedClubId, selectedTeamId, tournamentDays }) => {
  const renderMatchInfo = (startTime, field, ageGroup, group) => {
    const details = []
    if (fieldsCount > 1) details.push(field.name)
    const groupsTitle = buildGroupTitle(ageGroups, groups, ageGroup, group)
    if (groupsTitle) details.push(groupsTitle)
    return (
      <div>
        <span className="match__start-time">{formatMatchTime(tournamentDays, startTime)}</span>
        {details.length > 0 && <span className="match__details">{details.join(', ')}</span>}
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
          <span className="match__teams-separator">–</span>
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

  const { ageGroup, startTime, field, homeTeam, awayTeam, title, group } = match
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
  ageGroups: PropTypes.array.isRequired,
  clubs: PropTypes.arrayOf(PropTypes.shape({
    logoUrl: PropTypes.string,
  })).isRequired,
  fieldsCount: PropTypes.number.isRequired,
  groups: PropTypes.array.isRequired,
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
      ageGroupId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  selectedClubId: PropTypes.number,
  selectedTeamId: PropTypes.number,
  tournamentDays: PropTypes.number.isRequired,
}

export default Match
