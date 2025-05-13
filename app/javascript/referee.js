import PropTypes from 'prop-types'
import { createRoot } from 'react-dom/client'
import { useParams } from 'react-router'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AccessContext from './src/util/access_context'
import RefereePage from './src/official/referee_page'
import './src/styles/application.scss'

const RefereeApp = ({ tournamentId, refereeId, refereeName }) => {
  const { refereeAccessKey } = useParams()
  return (
    <AccessContext.Provider value={{ refereeAccessKey }}>
      <RefereePage tournamentId={tournamentId} refereeId={refereeId} refereeName={refereeName} />
    </AccessContext.Provider>
  )
}

RefereeApp.propTypes = {
  tournamentId: PropTypes.number.isRequired,
  refereeId: PropTypes.number.isRequired,
  refereeName: PropTypes.string.isRequired,
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('initial-data')
  const props = JSON.parse(node.getAttribute('data'))
  const tournamentId = parseInt(props.tournamentId)
  const refereeId = props.refereeId && parseInt(props.refereeId)
  const refereeName = props.refereeName
  const root = createRoot(document.getElementById('referee-app'))
  root.render(
    <BrowserRouter>
      <Routes>
        <Route
          path="/referees/:refereeAccessKey"
          element={<RefereeApp tournamentId={tournamentId} refereeId={refereeId} refereeName={refereeName} />}
        />
      </Routes>
    </BrowserRouter>
  )
})
