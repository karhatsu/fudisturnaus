import React from 'react'
import PropTypes from 'prop-types'
import GroupStageMatch from './group_stage_match'

const GroupStageMatches = ({ onItemDelete, onItemSave, tournament, tournamentId }) => {
  const { ageGroups, days, fields, groups, groupStageMatches, teams, id, matchMinutes, referees } = tournament
  const canMatches = teams.length > 1 && fields.length > 0

  const renderCannotAddGroupStageMatches = () => {
    return (
      <div className="tournament-item">
        Voit lisätä otteluita, kun olet lisännyt vähintään yhden kentän ja vähintään kaksi joukkuetta.
      </div>
    )
  }

  const renderGroupStageMatches = () => {
    const { ageGroups, days, fields, groups, groupStageMatches, teams, matchMinutes } = tournament
    return groupStageMatches.map(groupStageMatch => {
      return <GroupStageMatch
        key={groupStageMatch.id}
        ageGroups={ageGroups}
        fields={fields}
        groups={groups}
        groupStageMatch={groupStageMatch}
        groupStageMatches={groupStageMatches}
        onGroupStageMatchDelete={onItemDelete('groupStageMatches')}
        onGroupStageMatchSave={onItemSave('groupStageMatches')}
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
      <div className="title-2">Alkulohkojen ottelut</div>
      <div className="tournament-management__section tournament-management__section--group-stage-matches">
        {canMatches ? renderGroupStageMatches() : renderCannotAddGroupStageMatches()}
        {canMatches && <GroupStageMatch
          ageGroups={ageGroups}
          fields={fields}
          groups={groups}
          groupStageMatches={groupStageMatches}
          onGroupStageMatchSave={onItemSave('groupStageMatches')}
          matchMinutes={matchMinutes}
          referees={referees}
          teams={teams}
          tournamentDays={days}
          tournamentId={id}
          tournamentDate={tournament.startDate}
        />}
      </div>
    </>
  )
}

GroupStageMatches.propTypes = {
  onItemDelete: PropTypes.func.isRequired,
  onItemSave: PropTypes.func.isRequired,
  tournament: PropTypes.object.isRequired,
  tournamentId: PropTypes.number.isRequired,
}

export default GroupStageMatches
