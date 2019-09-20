import React from 'react'
import PropTypes from 'prop-types'

export default class SeriesAndTeams extends React.PureComponent {
  static propTypes = {
    tournament: PropTypes.shape({
      ageGroups: PropTypes.arrayOf({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      teams: PropTypes.arrayOf({
        ageGroupId: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  render() {
    return (
      <div className="series-and-teams">
        <div className="message message--warning message--full-page">Turnauksen otteluohjelma julkaistaan myöhemmin</div>
        {this.props.tournament.ageGroups.map(this.renderAgeGroup)}
      </div>
    )
  }

  renderAgeGroup = ageGroup => {
    const { id, name } = ageGroup
    const ageGroupTitle = this.props.tournament.ageGroups.length === 1 ? 'Ilmoittautuneet joukkueet' : name
    return (
      <div key={id}>
        <div className="title-2">{ageGroupTitle}</div>
        <div className="series-and-teams__age-group">{this.renderTeams(id)}</div>
      </div>
    )
  }

  renderTeams = ageGroupId => {
    const teams = this.props.tournament.teams.filter(team => team.ageGroupId === ageGroupId)
    if (!teams.length) {
      return <div>Sarjaan ei ole vielä ilmoittautunut yhtään joukkuetta</div>
    }
    return teams.map(this.renderTeam)
  }

  renderTeam = team => {
    const { id, name } = team
    return <div key={id} className="series-and-teams__team">{name}</div>
  }
}
