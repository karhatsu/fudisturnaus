import React from 'react'
import PropTypes from 'prop-types'
import AgeGroup from './age_group'

const AgeGroups = ({ ageGroups, onItemDelete, onItemSave, tournamentId }) => {
  const renderAgeGroups = () => {
    return ageGroups.map(ageGroup => {
      return <AgeGroup
        key={ageGroup.id}
        ageGroup={ageGroup}
        onAgeGroupDelete={onItemDelete('ageGroups')}
        onAgeGroupSave={onItemSave('ageGroups')}
        tournamentId={tournamentId}
      />
    })
  }

  return (
    <>
      <div className="title-2">Sarjat</div>
      <div className="tournament-management__section tournament-management__section--age-groups">
        {renderAgeGroups()}
        <AgeGroup onAgeGroupSave={onItemSave('ageGroups')} tournamentId={tournamentId}/>
      </div>
    </>
  )
}

AgeGroups.propTypes = {
  ageGroups: PropTypes.array.isRequired,
  onItemDelete: PropTypes.func.isRequired,
  onItemSave: PropTypes.func.isRequired,
  tournamentId: PropTypes.number.isRequired,
}

export default AgeGroups
