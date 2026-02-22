import Team from './team'
import Message from '../components/message'

const SeriesAndTeams = ({ tournament }) => {
  const renderInfo = () => {
    if (!tournament.cancelled) {
      return (
        <div>
          <div className="title-2">Otteluohjelma</div>
          <Message type="warning" fullPage={true}>
            Turnauksen otteluohjelma julkaistaan myöhemmin
          </Message>
        </div>
      )
    }
  }

  const renderAgeGroup = (ageGroup) => {
    const { id, name } = ageGroup
    const ageGroupTitle = oneAgeGroup() ? 'Ilmoittautuneet joukkueet' : name
    return (
      <div className="series-and-teams__age-group" key={id}>
        <div className="title-2">{ageGroupTitle}</div>
        <div className="series-and-teams__groups">{renderGroups(id)}</div>
      </div>
    )
  }

  const renderGroups = (ageGroupId) => {
    const ageGroupTeams = tournament.teams.filter((team) => team.ageGroupId === ageGroupId)
    if (!ageGroupTeams.length) {
      const msg = `${oneAgeGroup() ? 'Turnaukseen' : 'Sarjaan'} ei ole ilmoittautunut vielä yhtään joukkuetta`
      return <div className="series-and-teams__no-teams">{msg}</div>
    }
    const groups = tournament.groups.filter((group) => group.ageGroupId === ageGroupId)
    return groups.map((group) => renderGroup(group, groups.length > 1))
  }

  const renderGroup = (group, multipleGroups) => {
    const teams = tournament.teams.filter((team) => team.groupId === group.id)
    if (!teams.length) return
    return (
      <div className="series-and-teams__group" key={group.id}>
        {multipleGroups && <div className="series-and-teams__group-title">{group.name}</div>}
        {teams.map(renderTeam)}
      </div>
    )
  }

  const renderTeam = (team) => {
    const { clubId, id, name: teamName } = team
    return (
      <div className="series-and-teams__team" key={id}>
        <Team clubId={clubId} clubs={tournament.clubs} name={teamName} />
      </div>
    )
  }

  const oneAgeGroup = () => {
    return tournament.ageGroups.length === 1
  }

  return (
    <div className="series-and-teams">
      {renderInfo()}
      {tournament.ageGroups.map(renderAgeGroup)}
    </div>
  )
}

export default SeriesAndTeams
