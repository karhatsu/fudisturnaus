import React from 'react'
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

export default AgeGroups
