import React, { createContext, useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { fetchTournaments } from './api_client'

const AllTournamentsContext = createContext(undefined)

export const useAllTournaments = () => useContext(AllTournamentsContext)

export const AllTournamentsContextProvider = ({ children }) => {
  const [error, setError] = useState(false)
  const [tournaments, setTournaments] = useState(undefined)
  const [search, setSearch] = useState('')

  const fetchAllTournaments = useCallback(() => {
    fetchTournaments({}, (err, data) => {
      if (err) {
        setError(true)
      } else {
        const tournaments = data.filter(t => !t.test)
        setTournaments(tournaments)
      }
    })
  }, [])

  const value = { fetchAllTournaments, tournaments, error, search, setSearch }
  return <AllTournamentsContext.Provider value={value}>{children}</AllTournamentsContext.Provider>
}

AllTournamentsContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}
