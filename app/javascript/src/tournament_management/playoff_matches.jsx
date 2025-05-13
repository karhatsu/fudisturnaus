import React from 'react'
import PlayoffMatch from './playoff_match'

const PlayoffMatches = ({ onItemDelete, onItemSave, tournament, tournamentId }) => {
  const { ageGroups, days, fields, groups, playoffGroups, playoffMatches, teams, id, matchMinutes, startDate, referees } = tournament
  const ageGroupsIdsWithTables = ageGroups.filter(ageGroup => ageGroup.calculateGroupTables).map(ageGroup => ageGroup.id)
  const groupIdsWithTables = groups.filter(group => ageGroupsIdsWithTables.includes(group.ageGroupId)).map(group => group.id)
  const teamsWithTables = teams.filter(team => groupIdsWithTables.includes(team.groupId))
  const canAddMatches = teamsWithTables.length > 1 && fields.length > 0

  const renderCannotAddPlayoffMatches = () => {
    return (
      <div className="tournament-item">
        Jatko-otteluiden lisääminen vaatii vähintään yhden kentän sekä vähintään kaksi joukkuetta sarjassa,
        jolle lasketaan sarjataulukot.
      </div>
    )
  }

  const renderPlayoffMatches = () => {
    return playoffMatches.map(playoffMatch => {
      return <PlayoffMatch
        ageGroups={ageGroups}
        key={playoffMatch.id}
        fields={fields}
        groups={groups}
        playoffGroups={playoffGroups}
        playoffMatch={playoffMatch}
        playoffMatches={playoffMatches}
        onPlayoffMatchDelete={onItemDelete('playoffMatches')}
        onPlayoffMatchSave={onItemSave('playoffMatches')}
        matchMinutes={matchMinutes}
        referees={referees}
        teams={teams}
        tournamentDays={days}
        tournamentId={tournamentId}
        tournamentDate={tournament.startDate}
      />
    })
  }

  return (
    <>
      <div className="title-2">Jatko-ottelut</div>
      <div className="tournament-management__section tournament-management__section--playoff-matches">
        {canAddMatches ? renderPlayoffMatches() : renderCannotAddPlayoffMatches()}
        {canAddMatches && <PlayoffMatch
          ageGroups={ageGroups}
          fields={fields}
          groups={groups}
          playoffGroups={playoffGroups}
          playoffMatches={playoffMatches}
          onPlayoffMatchSave={onItemSave('playoffMatches')}
          matchMinutes={matchMinutes}
          referees={referees}
          teams={teams}
          tournamentDays={days}
          tournamentId={id}
          tournamentDate={startDate}
        />}
      </div>
    </>
  )
}

export default PlayoffMatches
