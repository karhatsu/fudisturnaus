import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AllTournamentsContextProvider } from './src/public/all_tournaments_context'
import Info from './src/public/info'
import TournamentsPage from './src/public/tournaments_page'
import PrivacyPolicyPage from './src/public/privacy_policy_page'
import Index from './src/public'
import { useParams } from 'react-router'
import TournamentPage, { officialLevels } from './src/public/tournament_page'
import Match from './src/public/match'
import './src/styles/application.scss'
import Toasts from './src/public/toasts'
import { ToastsContextProvider } from './src/public/toasts_context'

const TournamentPageWrapper = () => {
  const { key } = useParams()
  return (
    <ToastsContextProvider>
      <TournamentPage
        officialLevel={officialLevels.none}
        renderMatch={props => <Match {...props}/>}
        tournamentKey={key}
      />
      <Toasts />
    </ToastsContextProvider>
  )
}

const PublicApp = () => (
  <AllTournamentsContextProvider>
    <Routes>
      <Route path="info" element={<Info />}/>
      <Route path="t/:key" element={<TournamentPageWrapper />} />
      <Route path="tournaments" element={<TournamentsPage />}>
        <Route path=":key" element={<TournamentPageWrapper />} />
      </Route>
      <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/" element={<Index />} />
    </Routes>
  </AllTournamentsContextProvider>
)

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById('react-app'))
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  )
})
