import React from 'react'
import PropTypes from 'prop-types'

export default class TournamentPage extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      filters: {
        ageGroupId: null,
        groupId: null
      },
      tournament: undefined
    }
  }

  render() {
    const { tournament } = this.state
    if (!tournament) {
      return <div>Loading...</div>
    }
    const { name, location, startDate, ageGroups, groups, groupStageMatches } = tournament
    return (
      <div>
        <h2>{name} - {location}, {startDate}</h2>
        {this.renderFilter('ageGroupId', ageGroups, 'Sarja')}
        {this.renderFilter('groupId', groups, 'Lohko')}
        <h2>Alkusarjan ottelut</h2>
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
            {groupStageMatches.map(this.renderGroupStageMatch)}
          </tbody>
        </table>
      </div>
    )
  }

  renderFilter = (key, items, defaultText) => {
    return (
      <select onChange={this.setFilterValue(key)}>
        <option>{defaultText}</option>
        {items.map(item => {
          const { id, name } = item
          return <option key={id} value={id}>{name}</option>
        })}
      </select>
    )
  }

  setFilterValue = key => {
    return event => {
      const filters = { ...this.state.filters, [key]: parseInt(event.target.value) }
      this.setState({ filters })
    }
  }

  isFilterMatch = groupStageMatch => {
    const { filters } = this.state
    const { ageGroupId, groupId } = groupStageMatch
    return (!filters.ageGroupId || filters.ageGroupId === ageGroupId)
      && (!filters.groupId || filters.groupId === groupId)
  }

  renderGroupStageMatch = groupStageMatch => {
    const { id, startTime, field, homeTeam, awayTeam, homeGoals, awayGoals } = groupStageMatch
    if (this.isFilterMatch(groupStageMatch)) {
      return (
        <tr key={id}>
          <td>{startTime}</td>
          <td>{field.name}</td>
          <td>{homeTeam.name}</td>
          <td>{awayTeam.name}</td>
          <td>{homeGoals} - {awayGoals}</td>
        </tr>
      )
    }
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props
    fetch(`/api/v1/tournaments/${id}`)
      .then(response => response.json())
      .then(tournament => this.setState({ tournament }))
      .catch(console.error) // eslint-disable-line no-console
    this.subscribeToResultsChannel(id)
  }

  subscribeToResultsChannel = (tournamentId) => {
    // eslint-disable-next-line no-undef
    App.cable.subscriptions.create({
      channel: 'ResultsChannel',
      tournament_id: tournamentId
    }, {
      received: data => {
        const tournament = this.state.tournament
        const groupStageMatches = [...tournament.groupStageMatches]
        const matchIndex = groupStageMatches.findIndex(match => match.id === data.groupStageMatchId)
        if (matchIndex !== -1) {
          const match = { ...groupStageMatches[matchIndex], homeGoals: data.homeGoals, awayGoals: data.awayGoals }
          groupStageMatches.splice(matchIndex, 1, match)
          this.setState({ tournament: { ...tournament, groupStageMatches } })
        }
      }
    })
  }
}
