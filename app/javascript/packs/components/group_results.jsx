import React from 'react'
import PropTypes from 'prop-types'
import {resolveColStyles} from './util/util'

export default class GroupResults extends React.PureComponent {
  static propTypes = {
    group: PropTypes.shape({
      results: PropTypes.arrayOf(PropTypes.shape({
        teamName: PropTypes.string.isRequired
      })).isRequired,
    }).isRequired,
    groupsCount: PropTypes.number.isRequired,
  }

  render() {
    const { group: { name, results }, groupsCount } = this.props
    if (!results.length) {
      return null
    }
    return (
      <div className={resolveColStyles(groupsCount)}>
        <div className="group-results__group">
          <table>
            <thead>
              <tr>
                <th colSpan={7}>{name}</th>
              </tr>
              <tr>
                <th>Joukkue</th>
                <th title="Ottelut">O</th>
                <th title="Voitot">V</th>
                <th title="Tasapelit">T</th>
                <th title="Häviöt">H</th>
                <th>Maalit</th>
                <th title="Pisteet">P</th>
              </tr>
            </thead>
            <tbody>
              {results.map(this.renderGroupResultRow)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderGroupResultRow = teamGroupResults => {
    return (
      <tr key={teamGroupResults.teamName}>
        <td>{teamGroupResults.teamName}</td>
        <td>{teamGroupResults.matches}</td>
        <td>{teamGroupResults.wins}</td>
        <td>{teamGroupResults.draws}</td>
        <td>{teamGroupResults.losses}</td>
        <td>{teamGroupResults.goalsFor}-{teamGroupResults.goalsAgainst}</td>
        <td>{teamGroupResults.points}</td>
      </tr>
    )
  }
}
