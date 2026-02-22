import { createContext, useCallback, useContext, useState } from 'react'

const visibilityMs = 10000
const fadeOutMs = 300

export const toastStates = {
  appearing: 0,
  visible: 1,
  disappearing: 2,
}

const ToastsContext = createContext({})

export const useToasts = () => useContext(ToastsContext)

const findToastIndex = (toasts, type, id) => toasts.findIndex((t) => t.match.type === type && t.match.id === id)

export const ToastsContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const changeToastState = useCallback((type, id, state) => {
    setToasts((prev) => {
      const index = findToastIndex(prev, type, id)
      const newToasts = [...prev]
      if (index === -1) return prev
      if (state) {
        newToasts[index] = { ...newToasts[index], state }
        const nextState = state === toastStates.visible ? toastStates.disappearing : undefined
        const timeoutMs = state === toastStates.visible ? visibilityMs : fadeOutMs
        // eslint-disable-next-line react-hooks/immutability
        setTimeout(() => changeToastState(type, id, nextState), timeoutMs)
      } else {
        newToasts.splice(index, 1)
      }
      return newToasts
    })
  }, [])

  const addToast = useCallback(
    (match) => {
      setToasts((prev) => {
        const index = findToastIndex(prev, match.type, match.id)
        if (index !== -1) {
          const newToasts = [...prev]
          newToasts[index] = { ...newToasts[index], match }
          return newToasts
        } else {
          return [...prev, { match, state: toastStates.appearing }]
        }
      })
      setTimeout(() => changeToastState(match.type, match.id, toastStates.visible), 100)
    },
    [changeToastState],
  )

  const closeToast = useCallback((type, id) => {
    setToasts((prev) => {
      const index = findToastIndex(prev, type, id)
      const newToasts = [...prev]
      if (index !== -1) {
        newToasts.splice(index, 1)
      }
      return newToasts
    })
  }, [])

  const value = {
    addToast,
    closeToast,
    toasts,
  }

  return <ToastsContext.Provider value={value}>{children}</ToastsContext.Provider>
}
