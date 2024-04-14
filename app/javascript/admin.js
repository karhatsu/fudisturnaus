import React, { useCallback, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLoginPage from './src/admin/login_page'
import AccessContext from './src/util/access_context'
import AdminIndex from './src/admin'
import ClubsManagementPage from './src/admin/clubs_management_page'
import NewTournamentPage from './src/admin/new_tournament_page'
import TournamentManagementPage from './src/tournament_management/main'
import './src/styles/application.scss'
import ContactsPage from './src/admin/contacts_page'

const AdminApp = () => {
  const [sessionKey, setSessionKey] = useState()

  const onSuccessfulLogin = useCallback(sessionKey => {
    setSessionKey(sessionKey)
  }, [])

  if (!sessionKey) {
    return <AdminLoginPage onSuccessfulLogin={onSuccessfulLogin}/>
  }

  return (
    <AccessContext.Provider value={{ adminSessionKey: sessionKey }}>
      <Routes>
        <Route path="/" element={<AdminIndex />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="clubs" element={<ClubsManagementPage />}/>
        <Route path="tournaments">
          <Route path="new" element={<NewTournamentPage />}/>
          <Route path=":id" element={<TournamentManagementPage official={false} titleIconLink="/admin"/>} />
        </Route>
      </Routes>
    </AccessContext.Provider>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById('admin-app'))
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  )
})
