import Group from './group'

const PlayoffGroups = ({ onItemDelete, onItemSave, tournament, tournamentId }) => {
  const { ageGroups, playoffGroups } = tournament

  const renderCannotAddPlayoffGroups = () => {
    return <div className="tournament-item">Voit lisätä jatkolohkoja, kun olet lisännyt vähintään yhden sarjan.</div>
  }

  const renderPlayoffGroups = () => {
    return playoffGroups.map((playoffGroup) => {
      return (
        <Group
          key={playoffGroup.id}
          ageGroups={ageGroups}
          group={playoffGroup}
          onGroupDelete={onItemDelete('playoffGroups')}
          onGroupSave={onItemSave('playoffGroups')}
          type="playoffGroup"
          tournamentId={tournamentId}
        />
      )
    })
  }

  const ageGroupsWithGroupTables = ageGroups.filter((ageGroup) => ageGroup.calculateGroupTables)
  return (
    <>
      <div className="title-2">Jatkolohkot</div>
      <div className="tournament-management__section">
        <div className="tournament-item">
          Jos jatko-otteluista halutaan laskea sarjataulukot, luo sitä varten jatkolohko. Mikäli jatko-ottelut pelataan
          playoff-tyyppisesti, ei jatkolohkoja tarvita.
        </div>
        {ageGroupsWithGroupTables.length > 0 ? renderPlayoffGroups() : renderCannotAddPlayoffGroups()}
        {ageGroupsWithGroupTables.length > 0 && (
          <Group
            ageGroups={ageGroupsWithGroupTables}
            onGroupSave={onItemSave('playoffGroups')}
            tournamentId={tournamentId}
            type="playoffGroup"
          />
        )}
      </div>
    </>
  )
}

export default PlayoffGroups
