import React from 'react'
import PropTypes from 'prop-types'
import Group from './group'

const Groups = ({ onItemDelete, onItemSave, tournament, tournamentId }) => {
  const { ageGroups, groups } = tournament

  const renderCannotAddGroups = () => {
    return <div className="tournament-item">Voit lisätä lohkoja, kun olet lisännyt vähintään yhden sarjan.</div>
  }

  const renderGroups = () => {
    return groups.map(group => {
      return <Group
        key={group.id}
        ageGroups={ageGroups}
        group={group}
        onGroupDelete={onItemDelete('groups')}
        onGroupSave={onItemSave('groups')}
        tournamentId={tournamentId}
        type="group"
      />
    })
  }

  return (
    <>
      <div className="title-2">Lohkot</div>
      <div className="tournament-management__section tournament-management__section--groups">
        {ageGroups.length > 0 ? renderGroups() : renderCannotAddGroups()}
        {ageGroups.length > 0 && (
          <Group ageGroups={ageGroups} onGroupSave={onItemSave('groups')} tournamentId={tournamentId} type="group" />
        )}
      </div>
    </>
  )
}

Groups.propTypes = {
  onItemDelete: PropTypes.func.isRequired,
  onItemSave: PropTypes.func.isRequired,
  tournament: PropTypes.shape({
    ageGroups: PropTypes.array.isRequired,
    groups: PropTypes.array.isRequired,
  }).isRequired,
  tournamentId: PropTypes.number.isRequired,
}

export default Groups
