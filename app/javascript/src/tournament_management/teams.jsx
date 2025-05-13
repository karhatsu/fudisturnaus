import React from 'react'
import Team from './team'
import { getName } from '../util/util'

const Teams = ({ onClubSave, onItemDelete, onItemSave, tournament, tournamentId }) => {
  const { ageGroups, clubs, groups, teams } = tournament

  const renderCannotAddTeams = () => {
    return <div className="tournament-item">Voit lisätä joukkueita, kun olet lisännyt yhden lohkon.</div>
  }

  const renderTeams = (teams) => {
    return teams.map(team => {
      return <Team
        key={team.id}
        ageGroups={ageGroups}
        clubs={clubs}
        groups={groups}
        onClubSave={onClubSave}
        onTeamDelete={onItemDelete('teams')}
        onTeamSave={onItemSave('teams')}
        team={team}
        tournamentId={tournamentId}
      />
    })
  }

  const renderGroupTeams = () => {
    const teamsByGroups = teams.reduce((groupTeams, team) => {
      const { groupId } = team
      const group = groups.find(g => g.id === groupId)
      const key = `${getName(ageGroups, group.ageGroupId)} | ${group.name}`
      if (!groupTeams[key]) {
        groupTeams[key] = []
      }
      groupTeams[key].push(team)
      return groupTeams
    }, {})
    return Object.keys(teamsByGroups).map(group => {
      return (
        <div key={group}>
          <div className="tournament-management__section-title">{group}</div>
          {renderTeams(teamsByGroups[group])}
        </div>
      )
    })
  }

  const canAddTeams = groups.length > 0
  return (
    <>
      <div className="title-2">Joukkueet</div>
      <div className="tournament-management__section tournament-management__section--teams">
        {canAddTeams ? renderGroupTeams() : renderCannotAddTeams()}
        {canAddTeams && <Team
          ageGroups={ageGroups}
          clubs={clubs}
          groups={groups}
          onClubSave={onClubSave}
          onTeamSave={onItemSave('teams')}
          tournamentId={tournamentId}
        />}
      </div>
    </>
  )
}

export default Teams
