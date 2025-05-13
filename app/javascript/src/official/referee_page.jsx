import React from 'react'
import Message from '../components/message'
import { visibilityTypes } from '../util/enums'
import Matches from '../public/matches'
import EditableMatch from './editable_match'
import Loading from '../components/loading'
import useTournamentFetching from '../util/use_tournament_fetching'
import Title from '../components/title'
import CancelledBadge from '../public/cancelled_badge'
import TournamentSubTitle from '../public/tournament_sub_title'

const { all } = visibilityTypes

const RefereePage = ({ tournamentId, refereeId, refereeName }) => {
  const { error, tournament } = useTournamentFetching(tournamentId)

  const renderMatches = (matches, title) => {
    const { clubs, days, fields } = tournament
    if (!matches.length) return
    return (
      <div>
        <div className="title-2">{title}</div>
        <Matches
          ageGroups={tournament.ageGroups}
          clubs={clubs}
          fieldsCount={fields.length}
          groups={tournament.groups}
          matches={matches}
          renderMatch={EditableMatch}
          showEmptyError={false}
          tournamentDays={days}
          tournamentId={tournamentId}
        />
      </div>
    )
  }

  const renderContent = () => {
    if (error) {
      return <Message type="error">Virhe haettaessa turnauksen tietoja. Tarkasta verkkoyhteytesi ja lataa sivu uudestaan.</Message>
    }
    if (!tournament) {
      return <Loading/>
    }

    const groupStageMatches = tournament.groupStageMatches.filter(match => match.refereeId === refereeId)
    const playoffMatches = tournament.playoffMatches.filter(match => match.refereeId === refereeId)

    if (tournament.visibility !== all || (!groupStageMatches.length && !playoffMatches.length)) {
      const msg = 'Kun turnauksen otteluohjelma julkaistaan, pääset tällä sivulla tallentamaan otteluittesi tulokset.'
      return <Message type="warning" fullPage={true}>{msg}</Message>
    }
    return (
      <>
        {renderMatches(groupStageMatches, 'Alkulohkojen ottelut')}
        {renderMatches(playoffMatches, 'Jatko-ottelut')}
      </>
    )
  }

  const title = tournament ? `${tournament.name} - ${refereeName}` : 'fudisturnaus.com'
  const club = tournament ? tournament.club : undefined
  return (
    <div>
      <Title loading={!tournament && !error} text={title} club={club}>
        <CancelledBadge tournament={tournament} />
      </Title>
      <TournamentSubTitle tournament={tournament} />
      {renderContent()}
    </div>
  )
}

export default RefereePage
