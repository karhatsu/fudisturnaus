import { createRoot } from 'react-dom/client'
import { useParams } from 'react-router'
import { BrowserRouter, Route, Routes } from 'react-router'
import AccessContext from './src/util/access_context'
import TournamentManagementPage from './src/tournament_management/main'
import TournamentPage, { officialLevels } from './src/public/tournament_page'
import EditableMatch from './src/official/editable_match'
import './src/styles/application.scss'

const OfficialApp = ({ tournamentId }) => {
  const { accessKey } = useParams()

  return (
    <AccessContext.Provider value={{ officialAccessKey: accessKey }}>
      <Routes>
        <Route
          path="management"
          element={
            <TournamentManagementPage
              official={true}
              titleIconLink={`/official/${accessKey}`}
              tournamentId={tournamentId}
            />
          }
        />
        <Route
          path="/"
          element={
            <TournamentPage
              officialLevel={officialLevels.full}
              renderMatch={(props) => <EditableMatch {...props} />}
              tournamentKey={tournamentId}
            />
          }
        />
      </Routes>
    </AccessContext.Provider>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('initial-data')
  const props = JSON.parse(node.getAttribute('data'))
  const tournamentId = parseInt(props.tournamentId)
  const root = createRoot(document.getElementById('official-app'))
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/official/:accessKey/*" element={<OfficialApp tournamentId={tournamentId} />} />
      </Routes>
    </BrowserRouter>,
  )
})
