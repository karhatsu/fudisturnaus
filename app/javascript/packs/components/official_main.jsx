import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Loading from './loading'
import GroupStageMatches from './group_stage_matches'
import { addResult } from './util/util'
import './styles/application.scss'

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
    return (
      <div>
        <div className="title">{tournament ? tournament.name : 'fudisturnaus.com'}</div>
        {tournament ? this.renderContent() : <Loading/>}
      </div>
    )
  }

  renderContent() {
    const { tournament } = this.state
    return <GroupStageMatches
      accessKey={this.props.accessKey}
      editable={true}
      groupStageMatches={tournament.groupStageMatches}
      onSave={this.onSave}
    />
  }

  onSave = (groupStageMatchId, homeGoals, awayGoals) => {
    const tournament = this.state.tournament
    const groupStageMatches = addResult(tournament.groupStageMatches, groupStageMatchId, homeGoals, awayGoals)
    this.setState({ tournament: { ...tournament, groupStageMatches } })
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
