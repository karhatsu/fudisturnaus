import React, { createContext, useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const visibilityMs = 10000
const fadeOutMs = 300

export const toastStates = {
  appearing: 0,
  visible: 1,
  disappearing: 2,
}

const ToastsContext = createContext({})

export const useToasts = () => useContext(ToastsContext)

export const ToastsContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const changeToastState = useCallback((type, id, state) => {
    setToasts(prev => {
      const index = prev.findIndex(t => t.match.type === type && t.match.id === id)
      const newToasts = [...prev]
      if (index === -1) return prev
      if (state) {
        newToasts[index] = { ...newToasts[index], state }
        const nextState = state === toastStates.visible ? toastStates.disappearing : undefined
        const timeoutMs = state === toastStates.visible ? visibilityMs : fadeOutMs
        setTimeout(() => changeToastState(type, id, nextState), timeoutMs)
      } else {
        newToasts.splice(index, 1)
      }
      return newToasts
    })
  }, [])

  const addToast = useCallback(match => {
    setToasts(prev => {
      const index = prev.findIndex(t => t.match.type === match.type && t.match.id === match.id)
      if (index !== -1) {
        const newToasts = [...prev]
        newToasts[index] = { ...newToasts[index], match }
        return newToasts
      } else {
        return [...prev, { match, state: toastStates.appearing }]
      }
    })
    setTimeout(() => changeToastState(match.type, match.id, toastStates.visible), 100)
  }, [changeToastState])

  const value = {
    addToast,
    toasts,
  }

  return <ToastsContext.Provider value={value}>{children}</ToastsContext.Provider>
}

ToastsContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
}
