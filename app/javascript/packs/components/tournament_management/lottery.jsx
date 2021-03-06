import React from 'react'
import PropTypes from 'prop-types'
import GroupLottery from './group_lottery'

export default class Lottery extends React.PureComponent {
  static propTypes = {
    ageGroups: PropTypes.array.isRequired,
    groups: PropTypes.arrayOf(PropTypes.shape({
      ageGroupId: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      results: PropTypes.arrayOf(PropTypes.shape({
        ranking: PropTypes.number.isRequired,
        teamId: PropTypes.number.isRequired,
        teamName: PropTypes.string.isRequired,
        lot: PropTypes.number,
      })),
    })).isRequired,
    onLotterySave: PropTypes.func.isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  render() {
    const { ageGroups, groups, onLotterySave, tournamentId } = this.props
    const groupsWithResultsToBeSolved = groups.filter(group => group.results)
    if (!groupsWithResultsToBeSolved.length) {
      return this.renderInfo()
    }
    return groupsWithResultsToBeSolved.map(group => {
      return <GroupLottery ageGroups={ageGroups} group={group} key={group.id} onLotterySave={onLotterySave} tournamentId={tournamentId}/>
    })
  }

  renderInfo = () => {
    return (
      <div className="tournament-item">
        Jos jossain lohkossa on tasapistetilanne, joka ei ratkea maalierolla tai keskinäisillä otteluilla,
        voit tässä osiossa tallentaa arvonnan tiedot.
      </div>
    )
  }
}
