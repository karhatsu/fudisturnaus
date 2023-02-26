import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'

import { fetchTournament, updateTournament } from './api_client'
import { deleteTournament } from '../admin/api_client'
import Title from '../components/title'
import TournamentFields from './tournament_fields'
import Lottery from './lottery'
import AccessContext from '../util/access_context'
import { getName } from '../util/util'
import Button from '../form/button'
import FormErrors from '../form/form_errors'
import Message from '../components/message'
import Fields from './fields'
import AgeGroups from './age_groups'
import Groups from './groups'
import Teams from './teams'
import GroupStageMatches from './group_stage_matches'
import PlayoffGroups from './playoff_groups'
import PlayoffMatches from './playoff_matches'
import TournamentLinks from './tournament_links'
import EmailContent from './email_content'
import Referees from './referees'

const TournamentManagementPage = ({ official, titleIconLink, tournamentId }) => {
  const history = useHistory()
  const params = useParams()
  const accessContext = useContext(AccessContext)
  const [deleteErrors, setDeleteErrors] = useState([])
  const [error, setError] = useState(false)
  const [tournament, setTournament] = useState()

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
        <Fields fields={tournament.fields} tournamentId={getTournamentId()} onItemDelete={onItemDelete} onItemSave={onItemSave} />
        <AgeGroups ageGroups={tournament.ageGroups} tournamentId={getTournamentId()} onItemDelete={onItemDelete} onItemSave={onItemSave} />
        <Groups tournament={tournament} tournamentId={getTournamentId()} onItemDelete={onItemDelete} onItemSave={onItemSave} />
        <Teams tournament={tournament} tournamentId={getTournamentId()} onClubSave={onClubSave} onItemDelete={onItemDelete} onItemSave={onItemSave} />
        <GroupStageMatches tournament={tournament} tournamentId={getTournamentId()} onItemDelete={onItemDelete} onItemSave={onItemSave} />
        <Lottery tournament={tournament} tournamentId={getTournamentId()} onLotterySave={onLotterySave} />
        <PlayoffGroups tournament={tournament} tournamentId={getTournamentId()} onItemDelete={onItemDelete} onItemSave={onItemSave} />
        <PlayoffMatches tournament={tournament} tournamentId={getTournamentId()} onItemDelete={onItemDelete} onItemSave={onItemSave} />
        <Referees tournament={tournament} tournamentId={getTournamentId()} onItemDelete={onItemDelete} onItemSave={onItemSave} />
        <TournamentLinks tournament={tournament} />
        {!official && <EmailContent tournament={tournament} />}
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

  const onClubSave = data => {
    const clubs = [...tournament.clubs]
    const clubIndex = clubs.findIndex(club => club.id === data.id)
    if (clubIndex === -1) {
      clubs.push(data)
      clubs.sort((a, b) => a.name.localeCompare(b.name))
      setTournament({ ...tournament, clubs })
    }
  }

  const onLotterySave = (groupId, data) => {
    const groups = [...tournament.groups]
    const index = groups.findIndex(group => group.id === groupId)
    groups[index] = { ...groups[index], results: data.results }
    setTournament({ ...tournament, groups })
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
      case 'referees':
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
      <Title club={tournament?.club} iconLink={titleIconLink} loading={!tournament && !error} text={title}/>
      {renderContent()}
    </div>
  )
}

TournamentManagementPage.propTypes = {
  official: PropTypes.bool.isRequired,
  titleIconLink: PropTypes.string.isRequired,
  tournamentId: PropTypes.number,
}

export default TournamentManagementPage
