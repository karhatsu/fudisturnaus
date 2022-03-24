import { useCallback, useEffect, useState } from 'react'
import { fetchTournament } from '../public/api_client'
import consumer from '../../channels/consumer'
import { buildTournamentFromSocketData } from './util'

const useTournamentFetching = tournamentKey => {
  const [error, setError] = useState(false)
  const [tournament, setTournament] = useState()
  const [subscribed, setSubscribed] = useState(false)
  const [socketData, setSocketData] = useState()

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

  useEffect(() => {
    if (tournament && !subscribed) {
      consumer.subscriptions.create({ channel: 'ResultsChannel', tournament_id: tournament.id }, { received: data => setSocketData(data) })
      setSubscribed(true)
    }
  }, [tournament, subscribed])

  useEffect(() => {
    if (socketData) {
      const newTournament = buildTournamentFromSocketData(tournament, socketData)
      setSocketData()
      setTournament(newTournament)
    }
  }, [tournament, socketData])

  return { error, tournament }
}

export default useTournamentFetching
