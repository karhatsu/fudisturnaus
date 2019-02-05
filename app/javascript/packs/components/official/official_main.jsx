import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import GroupStageMatch from './group_stage_match'

export default class OfficialMain extends React.PureComponent {
  static propTypes = {
    accessKey: PropTypes.string.isRequired,
    tournamentId: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      tournament: undefined
    }
  }

  render() {
    const { tournament } = this.state
    if (!tournament) {
      return <div>Loading...</div>
    }
    return (
      <div>
        <h2>{tournament.name}</h2>
        <h3>Alkusarjan ottelut</h3>
        <table>
          <thead>
            <tr>
              <th>Aika</th>
              <th>Kenttä</th>
              <th>Koti</th>
              <th>Vieras</th>
              <th>Tulos</th>
            </tr>
          </thead>
          <tbody>
            {tournament.groupStageMatches.map(this.renderGroupStageMatch)}
          </tbody>
        </table>
      </div>
    )
  }

  renderGroupStageMatch = groupStageMatch => {
    const { accessKey } = this.props
    return <GroupStageMatch key={groupStageMatch.id} accessKey={accessKey} match={groupStageMatch} />
  }

  componentDidMount() {
    const { tournamentId } = this.props
    fetch(`/api/v1/tournaments/${tournamentId}`)
      .then(response => response.json())
      .then(tournament => this.setState({ tournament }))
      .catch(console.error) // eslint-disable-line no-console
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('initial-data')
  const props = JSON.parse(node.getAttribute('data'))
  ReactDOM.render(
    <OfficialMain {...props}/>,
    document.getElementById('official-app'),
  )
})
