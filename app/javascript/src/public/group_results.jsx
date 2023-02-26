import React from 'react'
import PropTypes from 'prop-types'
import { resolveColStyles } from '../util/util'
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

  const resolveTitle = () => {
    const { ageGroup, ageGroupId, name } = group
    const groupsInAgeGroup = groups.filter(g => g.ageGroupId === ageGroupId)
    if (ageGroups.length === 1 && groupsInAgeGroup.length === 1) return undefined // 1 age group, 1 group -> no title needed
    if (groupsInAgeGroup.length === 1) return ageGroup.name // 1 group in this age group -> use age group name as title
    if (ageGroups.length === 1) return name // 1 age group, multiple groups -> use group name as title
    return `${ageGroup.name} ${name}` // multiple age groups and groups -> use both names in title
  }

  const resolveTeamClasses = teamGroupResults => {
    const filteredTeam = teamGroupResults.clubId === filters.clubId || teamGroupResults.teamId === filters.teamId
    return filteredTeam ? 'group-results__team--active' : ''
  }

  const { results } = group
  if (!results.length) {
    return null
  }
  const title = resolveTitle()
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

GroupResults.propTypes = {
  ageGroups: PropTypes.array.isRequired,
  clubs: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  group: PropTypes.shape({
    ageGroupId: PropTypes.number.isRequired,
    ageGroup: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape({
      teamName: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  groups: PropTypes.array.isRequired,
  visibleGroupsCount: PropTypes.number.isRequired,
  showLottery: PropTypes.bool.isRequired,
}

export default GroupResults
