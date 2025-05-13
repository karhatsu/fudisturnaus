import React from 'react'
import GroupLottery from './group_lottery'

const Lottery = ({ onLotterySave, tournament, tournamentId }) => {
  const { ageGroups, groups } = tournament
  const renderInfo = () => {
    return (
      <div className="tournament-item">
        Jos jossain lohkossa on tasapistetilanne, joka ei ratkea maalierolla tai keskinäisillä otteluilla,
        voit tässä osiossa tallentaa arvonnan tiedot.
      </div>
    )
  }

  const renderContent = () => {
    const groupsWithResultsToBeSolved = groups.filter(group => group.results)
    if (!groupsWithResultsToBeSolved.length) {
      return renderInfo()
    }
    return groupsWithResultsToBeSolved.map(group => {
      return (
        <GroupLottery
          ageGroups={ageGroups}
          group={group}
          key={group.id}
          onLotterySave={onLotterySave}
          tournamentId={tournamentId}
        />
      )
    })
  }

  return (
    <>
      <div className="title-2">Tasatilanteen ratkaisu arvalla</div>
      <div className="tournament-management__section tournament-management__section--lottery">
        {renderContent()}
      </div>
    </>
  )
}

export default Lottery
