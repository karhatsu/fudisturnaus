import React from 'react'
import { buildGroupTitle, resolveColStyles } from '../util/util'
import Team from './team'

const GroupResults = ({ ageGroups, clubs, filters, group, groups, visibleGroupsCount, showLottery }) => {

  const renderGroupResultRow = (allResults, teamGroupResults, index) => {
    const { clubId, ranking, teamName, lot, matches, wins, draws, losses, goalsFor, goalsAgainst, points } = teamGroupResults
    const rankingText = index > 0 && ranking === allResults[index - 1].ranking ? '' : `${ranking}.`
    const team = `${teamName}${showLottery && typeof lot === 'number' ? ` (arpa: ${lot})` : ''}`
    return (
      <tr key={teamName} className={resolveTeamClasses(teamGroupResults)}>
        <td>{rankingText}</td>
        <td className="group-results__team-name">
          <Team clubId={clubId} clubs={clubs} name={team} />
        </td>
        <td>{matches}</td>
        <td>{wins}</td>
        <td>{draws}</td>
        <td>{losses}</td>
        <td>{goalsFor}-{goalsAgainst}</td>
        <td>{points}</td>
      </tr>
    )
  }

  const resolveTeamClasses = teamGroupResults => {
    const filteredTeam = teamGroupResults.clubId === filters.clubId || teamGroupResults.teamId === filters.teamId
    return filteredTeam ? 'group-results__team--active' : ''
  }

  const { results } = group
  if (!results.length) {
    return null
  }
  const title = buildGroupTitle(ageGroups, groups, group.ageGroup, group)
  return (
    <div className={resolveColStyles(visibleGroupsCount)}>
      <div className="group-results__group">
        <table>
          <thead>
            {title && (
              <tr>
                <th colSpan={7} className="group-results__title">{title}</th>
              </tr>
            )}
            <tr>
              <th/>
              <th className="group-results__team-name">Joukkue</th>
              <th title="Ottelut">O</th>
              <th title="Voitot">V</th>
              <th title="Tasapelit">T</th>
              <th title="Häviöt">H</th>
              <th>Maalit</th>
              <th title="Pisteet">P</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => renderGroupResultRow(results, result, index))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GroupResults
