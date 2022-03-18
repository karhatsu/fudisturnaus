import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import * as clipboard from 'clipboard-polyfill'

import { fetchTournament, updateTournament } from './api_client'
import { deleteTournament } from '../admin/api_client'
import Title from '../components/title'
import TournamentFields from './tournament_fields'
import AgeGroup from './age_group'
import Group from './group'
import GroupStageMatch from './group_stage_match'
import PlayoffMatch from './playoff_match'
import Field from './field'
import Team from './team'
import Lottery from './lottery'
import AccessContext from '../util/access_context'
import { getName } from '../util/util'
import OfficialLinkCopy from './official_link_copy'
import Button from '../form/button'
import FormErrors from '../form/form_errors'
import Message from '../components/message'
import { buildUrl } from '../util/url_util'

/* eslint-disable max-len */
const linkTexts = {
  accessKey: {
    description: 'Tällä linkillä pääsee hallinnoimaan turnauksen kaikkia asetuksia sekä syöttämään tuloksia. Jaa se vain turnauksen toimihenkilöille.',
    title: 'Kopioi linkki hallintasivuille',
  },
  resultsAccessKey: {
    description: 'Tällä linkillä pääsee syöttämään tuloksia. Voit jakaa sen esim. turnauksen tuomareille.',
    title: 'Kopioi linkki tulosten syöttöön',
  },
  publicLink: {
    description: 'Tällä linkillä pääsee katsomaan tuloksia. Voit jakaa sen kenelle tahansa, esim. turnaukseen osallistuville joukkueille.',
    title: 'Kopioi julkinen linkki',
  },
}
/* eslint-enable max-len */

const TournamentManagementPage = ({ official, titleIconLink, tournamentId }) => {
  const history = useHistory()
  const params = useParams()
  const accessContext = useContext(AccessContext)
  const [deleteErrors, setDeleteErrors] = useState([])
  const [error, setError] = useState(false)
  const [tournament, setTournament] = useState()
  const [emailCopied, setEmailCopied] = useState(false)

  const fetchTournamentData = () => {
    fetchTournament(accessContext, getTournamentId(), (err, tournament) => {
      if (tournament) {
        const teams = [...tournament.teams]
        setTournament({ ...tournament, teams: teams.sort(getComparator(tournament, 'teams')) })
      } else if (err && !tournament) {
        setError(true)
      }
    })
  }

  useEffect(() => {
    fetchTournamentData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const renderContent = () => {
    if (!tournament) return null
    const { visibility } = tournament
    return (
      <div>
        {visibility < 2 && <Message type="warning">Kun haluat julkaista otteluohjelman, muokkaa turnauksen perustietoja</Message>}
        <div className="title-2">Perustiedot</div>
        <div className="tournament-management__section tournament-management__section--tournament">
          <TournamentFields clubs={tournament.clubs} onSave={onSave} tournament={tournament}/>
        </div>
        <div className="title-2">Kentät</div>
        {renderFieldsSection()}
        <div className="title-2">Sarjat</div>
        {renderAgeGroupsSection()}
        <div className="title-2">Lohkot</div>
        {renderGroupsSection()}
        <div className="title-2">Joukkueet</div>
        {renderTeamsSection()}
        <div className="title-2">Alkulohkojen ottelut</div>
        {renderGroupStageMatchesSection()}
        <div className="title-2">Tasatilanteen ratkaisu arvalla</div>
        {renderLotterySection()}
        <div className="title-2">Jatkolohkot</div>
        {renderPlayoffGroupsSection()}
        <div className="title-2">Jatko-ottelut</div>
        {renderPlayoffMatchesSection()}
        <div className="title-2">Turnauksen linkit</div>
        {renderTournamentLinks()}
        {renderEmailContent()}
        {renderDeleteButton()}
        {renderBackLink()}
      </div>
    )
  }

  const onSave = (form, callback) => {
    updateTournament(accessContext, getTournamentId(), form, (errors, data) => {
      callback(errors, data)
      fetchTournamentData()
    })
  }

  const renderFieldsSection = () => {
    return (
      <div className="tournament-management__section tournament-management__section--fields">
        {renderFields()}
        <Field onFieldSave={onItemSave('fields')} tournamentId={getTournamentId()}/>
      </div>
    )
  }

  const renderFields = () => {
    return tournament.fields.map(field => {
      return <Field
        key={field.id}
        field={field}
        onFieldDelete={onItemDelete('fields')}
        onFieldSave={onItemSave('fields')}
        tournamentId={getTournamentId()}
      />
    })
  }

  const renderAgeGroupsSection = () => {
    return (
      <div className="tournament-management__section tournament-management__section--age-groups">
        {renderAgeGroups()}
        <AgeGroup onAgeGroupSave={onItemSave('ageGroups')} tournamentId={getTournamentId()}/>
      </div>
    )
  }

  const renderAgeGroups = () => {
    return tournament.ageGroups.map(ageGroup => {
      return <AgeGroup
        key={ageGroup.id}
        ageGroup={ageGroup}
        onAgeGroupDelete={onItemDelete('ageGroups')}
        onAgeGroupSave={onItemSave('ageGroups')}
        tournamentId={getTournamentId()}
      />
    })
  }

  const renderGroupsSection = () => {
    const { ageGroups, id } = tournament
    return (
      <div className="tournament-management__section tournament-management__section--groups">
        {ageGroups.length > 0 ? renderGroups() : renderCannotAddGroups()}
        {ageGroups.length > 0 && (
          <Group ageGroups={ageGroups} onGroupSave={onItemSave('groups')} tournamentId={id} type="group" />
        )}
      </div>
    )
  }

  const renderCannotAddGroups = () => {
    return (
      <div className="tournament-item">
        Voit lisätä lohkoja, kun olet lisännyt vähintään yhden sarjan.
      </div>
    )
  }

  const renderGroups = () => {
    const { ageGroups, groups } = tournament
    return groups.map(group => {
      return <Group
        key={group.id}
        ageGroups={ageGroups}
        group={group}
        onGroupDelete={onItemDelete('groups')}
        onGroupSave={onItemSave('groups')}
        tournamentId={getTournamentId()}
        type="group"
      />
    })
  }

  const renderTeamsSection = () => {
    const { ageGroups, clubs, groups, id } = tournament
    const canAddTeams = groups.length > 0
    return (
      <div className="tournament-management__section tournament-management__section--teams">
        {canAddTeams ? renderGroupTeams() : renderCannotAddTeams()}
        {canAddTeams && <Team
          ageGroups={ageGroups}
          clubs={clubs}
          groups={groups}
          onClubSave={onClubSave}
          onTeamSave={onItemSave('teams')}
          tournamentId={id}
        />}
      </div>
    )
  }

  const renderCannotAddTeams = () => {
    return (
      <div className="tournament-item">
        Voit lisätä joukkueita, kun olet lisännyt yhden lohkon.
      </div>
    )
  }

  const renderGroupTeams = () => {
    const { ageGroups, groups, teams } = tournament
    const teamsByGroups = teams.reduce((groupTeams, team) => {
      const { groupId } = team
      const group = groups.find(g => g.id === groupId)
      const key = `${group.name} (${getName(ageGroups, group.ageGroupId)})`
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

  const renderTeams = (teams) => {
    const { ageGroups, clubs, groups } = tournament
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
        tournamentId={getTournamentId()}
      />
    })
  }

  const onClubSave = data => {
    const clubs = [...tournament.clubs]
    const clubIndex = clubs.findIndex(club => club.id === data.id)
    if (clubIndex === -1) {
      clubs.push(data)
      clubs.sort((a, b) => a.name.localeCompare(b.name))
      setTournament({ ...tournament, clubs })
    }
  }

  const renderGroupStageMatchesSection = () => {
    const { ageGroups, days, fields, groups, groupStageMatches, teams, id, matchMinutes } = tournament
    const canMatches = teams.length > 1 && fields.length > 0
    return (
      <div className="tournament-management__section tournament-management__section--group-stage-matches">
        {canMatches ? renderGroupStageMatches() : renderCannotAddGroupStageMatches()}
        {canMatches && <GroupStageMatch
          ageGroups={ageGroups}
          fields={fields}
          groups={groups}
          groupStageMatches={groupStageMatches}
          onGroupStageMatchSave={onItemSave('groupStageMatches')}
          matchMinutes={matchMinutes}
          teams={teams}
          tournamentDays={days}
          tournamentId={id}
          tournamentDate={tournament.startDate}
        />}
      </div>
    )
  }

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
        onClubSave={onClubSave}
        onGroupStageMatchDelete={onItemDelete('groupStageMatches')}
        onGroupStageMatchSave={onItemSave('groupStageMatches')}
        matchMinutes={matchMinutes}
        teams={teams}
        tournamentDays={days}
        tournamentId={getTournamentId()}
        tournamentDate={tournament.startDate}
      />
    })
  }

  const renderLotterySection = () => {
    const { ageGroups, groups } = tournament
    return (
      <div className="tournament-management__section tournament-management__section--lottery">
        <Lottery ageGroups={ageGroups} groups={groups} onLotterySave={onLotterySave} tournamentId={getTournamentId()}/>
      </div>
    )
  }

  const onLotterySave = (groupId, data) => {
    const groups = [...tournament.groups]
    const index = groups.findIndex(group => group.id === groupId)
    groups[index] = { ...groups[index], results: data.results }
    setTournament({ ...tournament, groups })
  }

  const renderPlayoffGroupsSection = () => {
    const { id } = tournament
    const ageGroups = tournament.ageGroups.filter(ageGroup => ageGroup.calculateGroupTables)
    return (
      <div className="tournament-management__section">
        <div className="tournament-item">
          Jos jatko-otteluista halutaan laskea sarjataulukot, luo sitä varten jatkolohko.
          Mikäli jatko-ottelut pelataan playoff-tyyppisesti, ei jatkolohkoja tarvita.
        </div>
        {ageGroups.length > 0 ? renderPlayoffGroups() : renderCannotAddPlayoffGroups()}
        {ageGroups.length > 0 && (
          <Group ageGroups={ageGroups} onGroupSave={onItemSave('playoffGroups')} tournamentId={id} type="playoffGroup" />
        )}
      </div>
    )
  }

  const renderCannotAddPlayoffGroups = () => {
    return (
      <div className="tournament-item">
        Voit lisätä jatkolohkoja, kun olet lisännyt vähintään yhden sarjan.
      </div>
    )
  }

  const renderPlayoffGroups = () => {
    const { ageGroups, playoffGroups } = tournament
    return playoffGroups.map(playoffGroup => {
      return <Group
        key={playoffGroup.id}
        ageGroups={ageGroups}
        group={playoffGroup}
        onGroupDelete={onItemDelete('playoffGroups')}
        onGroupSave={onItemSave('playoffGroups')}
        type="playoffGroup"
        tournamentId={getTournamentId()}
      />
    })
  }

  const renderPlayoffMatchesSection = () => {
    const { ageGroups, days, fields, groups, playoffGroups, playoffMatches, teams, id, matchMinutes } = tournament
    const ageGroupsIdsWithTables = ageGroups.filter(ageGroup => ageGroup.calculateGroupTables).map(ageGroup => ageGroup.id)
    const groupIdsWithTables = groups.filter(group => ageGroupsIdsWithTables.includes(group.ageGroupId)).map(group => group.id)
    const teamsWithTables = teams.filter(team => groupIdsWithTables.includes(team.groupId))
    const canAddMatches = teamsWithTables.length > 1 && fields.length > 0
    return (
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
          teams={teams}
          tournamentDays={days}
          tournamentId={id}
          tournamentDate={tournament.startDate}
        />}
      </div>
    )
  }

  const renderCannotAddPlayoffMatches = () => {
    return (
      <div className="tournament-item">
        Jatko-otteluiden lisääminen vaatii vähintään yhden kentän sekä vähintään kaksi joukkuetta sarjassa,
        jolle lasketaan sarjataulukot.
      </div>
    )
  }

  const renderPlayoffMatches = () => {
    const { ageGroups, days, fields, groups, playoffGroups, playoffMatches, teams, matchMinutes } = tournament
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
        teams={teams}
        tournamentDays={days}
        tournamentId={getTournamentId()}
        tournamentDate={tournament.startDate}
      />
    })
  }

  const onItemSave = itemName => data => {
    const items = [...tournament[itemName]]
    const itemIndex = items.findIndex(item => item.id === data.id)
    if (itemIndex !== -1) {
      items[itemIndex] = { ...items[itemIndex], ...data }
    } else {
      items.push(data)
    }
    setTournament({ ...tournament, [itemName]: items.sort(getComparator(tournament, itemName)) })
  }

  const onItemDelete = itemName => id => {
    const items = [...tournament[itemName]]
    const itemIndex = items.findIndex(item => item.id === id)
    items.splice(itemIndex, 1)
    setTournament({ ...tournament, [itemName]: items })
  }

  const getComparator = (tournament, itemName) => {
    switch (itemName) {
      case 'ageGroups':
      case 'fields':
        return (a, b) => a.name.localeCompare(b.name)
      case 'teams':
        return (a, b) => {
          const { ageGroups, groups } = tournament
          const ageGroupCompare = getName(ageGroups, a.ageGroupId).localeCompare(getName(ageGroups, b.ageGroupId))
          if (ageGroupCompare !== 0) {
            return ageGroupCompare
          }
          const groupCompare = getName(groups, a.groupId).localeCompare(getName(groups, b.groupId))
          if (groupCompare !== 0) {
            return groupCompare
          }
          return a.name.localeCompare(b.name)
        }
      case 'groups':
      case 'playoffGroups':
        return (a, b) => {
          const { ageGroups } = tournament
          const ageGroupCompare = getName(ageGroups, a.ageGroupId).localeCompare(getName(ageGroups, b.ageGroupId))
          if (ageGroupCompare !== 0) {
            return ageGroupCompare
          }
          return a.name.localeCompare(b.name)
        }
      case 'groupStageMatches':
      case 'playoffMatches':
        return (a, b) => {
          const { fields } = tournament
          const timeCompare = a.startTime.localeCompare(b.startTime)
          if (timeCompare !== 0) {
            return timeCompare
          }
          return getName(fields, a.fieldId).localeCompare(getName(fields, b.fieldId))
        }
      default:
        console.error('No comparator for', itemName) // eslint-disable-line no-console
    }
  }

  const renderTournamentLinks = () => {
    const { accessKey, resultsAccessKey, publicLink } = linkTexts
    return (
      <React.Fragment>
        <OfficialLinkCopy
          description={accessKey.description}
          path={`/official/${tournament.accessKey}`}
          title={accessKey.title}
        />
        <OfficialLinkCopy
          description={resultsAccessKey.description}
          path={`/results/${tournament.resultsAccessKey}`}
          title={resultsAccessKey.title}
        />
        <OfficialLinkCopy
          description={publicLink.description}
          path={`/t/${tournament.slug}`}
          title={publicLink.title}
        />
      </React.Fragment>
    )
  }

  const renderEmailContent = () => {
    if (!official) {
      return (
        <>
          <div className="title-2">Sähköposti</div>
          <div className="tournament-management__section">
            <Button onClick={copyEmailContent} label="Kopioi teksti" type="primary" />
            {emailCopied && <Message type="success">Sähköposti kopioitu leikepöydälle</Message>}
          </div>
        </>
      )
    }
  }

  const copyEmailContent = () => {
    const email = `Moikka!

Tällä linkillä pääset syöttämään turnauksen sarjat ja ottelut:
${buildUrl(`/official/${tournament.accessKey}`)}

Tätä linkkiä voit jakaa osallistuville joukkueille:
${buildUrl(`/t/${tournament.slug}`)}

Laita viestiä jos tarvitset lisäohjeita, niin autan mielelläni.

Henri`
    clipboard.writeText(email).then(() => {
      setEmailCopied(true)
      setTimeout(() => {
        setEmailCopied(false)
      }, 5000)
    }).catch(console.error)
  }

  const renderDeleteButton = () => {
    if (!official) {
      return (
        <React.Fragment>
          <div className="title-2">Poista turnaus</div>
          <div className="tournament-management__section">
            <FormErrors errors={deleteErrors} />
            <Button onClick={handleDelete} label="Poista turnaus" type="danger" />
          </div>
        </React.Fragment>
      )
    }
  }

  const handleDelete = () => {
    deleteTournament(accessContext, getTournamentId(), errors => {
      if (errors) {
        setDeleteErrors(errors)
      } else {
        history.push('/admin')
      }
    })
  }

  const renderBackLink = () => {
    if (official) {
      const to = `/official/${tournament.accessKey}`
      return (
        <React.Fragment>
          <div className="title-2">Takaisin tulosten syöttöön</div>
          <div className="tournament-management__section">
            <Link to={to} className="back-link">&lt;- Takaisin tulosten syöttöön</Link>
          </div>
        </React.Fragment>
      )
    }
  }

  const getTournamentId = () => {
    return tournamentId || parseInt(params.id)
  }

  const titlePrefix = tournament ? tournament.name : 'fudisturnaus.com'
  const title = `${titlePrefix} - Hallintasivut`
  return (
    <div>
      <Title iconLink={titleIconLink} loading={!tournament && !error} text={title}/>
      {renderContent()}
    </div>
  )
}

TournamentManagementPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  official: PropTypes.bool.isRequired,
  titleIconLink: PropTypes.string.isRequired,
  tournamentId: PropTypes.number,
}

export default TournamentManagementPage
