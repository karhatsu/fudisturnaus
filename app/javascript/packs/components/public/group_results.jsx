import React from 'react'
import PropTypes from 'prop-types'
import { resolveColStyles } from '../util/util'
import Team from './team'

export default class GroupResults extends React.PureComponent {
  static propTypes = {
    clubs: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    group: PropTypes.shape({
      ageGroup: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      name: PropTypes.string.isRequired,
      results: PropTypes.arrayOf(PropTypes.shape({
        teamName: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    groupsCount: PropTypes.number.isRequired,
  }

  render() {
    const { group: { ageGroup, name, results }, groupsCount } = this.props
    if (!results.length) {
      return null
    }
    return (
      <div className={resolveColStyles(groupsCount)}>
        <div className="group-results__group">
          <table>
            <thead>
              <tr>
                <th colSpan={7} className="group-results__title">{ageGroup.name} {name}</th>
              </tr>
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
              {results.map((result, index) => this.renderGroupResultRow(results, result, index))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderGroupResultRow = (allResults, teamGroupResults, index) => {
    const { clubId, ranking, teamName, lot, matches, wins, draws, losses, goalsFor, goalsAgainst, points } = teamGroupResults
    const rankingText = index > 0 && ranking === allResults[index - 1].ranking ? '' : `${ranking}.`
    const team = `${teamName}${typeof lot === 'number' ? ` (arpa: ${lot})` : ''}`
    return (
      <tr key={teamName} className={this.resolveTeamClasses(teamGroupResults)}>
        <td>{rankingText}</td>
        <td className="group-results__team-name">
          <Team clubId={clubId} clubs={this.props.clubs} name={team} />
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

  resolveTeamClasses = teamGroupResults => {
    const { filters } = this.props
    const filteredTeam = teamGroupResults.clubId === filters.clubId || teamGroupResults.teamId === filters.teamId
    return filteredTeam ? 'group-results__team--active' : ''
  }
}
