import { useCallback, useEffect, useState } from 'react'
import { fetchTournament } from '../public/api_client'
import consumer from '../../channels/consumer'
import { buildTournamentFromSocketData } from './util'

const useTournamentFetching = tournamentKey => {
  const [error, setError] = useState(false)
  const [tournament, setTournament] = useState()
  const [subscribed, setSubscribed] = useState(false)
  const tournamentId = tournament?.id

  const fetchTournamentData = useCallback(() => {
    fetchTournament(tournamentKey, (err, tournament) => {
      if (tournament) {
        setTournament(tournament)
      } else if (err && !tournament) {
        setError(true)
      }
    })
  }, [tournamentKey])

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      fetchTournamentData()
    }
  }, [fetchTournamentData])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    fetchTournamentData()
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchTournamentData, handleVisibilityChange])

  const handleSocketData = useCallback((socketData) => {
    setTournament(oldTournament => {
      return buildTournamentFromSocketData(oldTournament, socketData)
    })
  }, [])

  useEffect(() => {
    if (tournamentId && !subscribed) {
      setSubscribed(true)
      consumer.subscriptions.create({ channel: 'ResultsChannel', tournament_id: tournamentId }, { received: data => handleSocketData(data) })
    }
  }, [tournamentId, subscribed, handleSocketData])

  return { error, tournament }
}

export default useTournamentFetching
