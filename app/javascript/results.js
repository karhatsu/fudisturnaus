import PropTypes from 'prop-types'
import { createRoot } from 'react-dom/client'
import { useParams } from 'react-router'
import { BrowserRouter, Route, Routes } from 'react-router'
import AccessContext from './src/util/access_context'
import EditableMatch from './src/official/editable_match'
import TournamentPage, { officialLevels } from './src/public/tournament_page'
import './src/styles/application.scss'

const ResultsApp = ({ tournamentId }) => {
  const { resultsAccessKey } = useParams()
  return (
    <AccessContext.Provider value={{ resultsAccessKey }}>
      <TournamentPage
        officialLevel={officialLevels.results}
        renderMatch={props => <EditableMatch {...props}/>}
        tournamentKey={tournamentId}
      />
    </AccessContext.Provider>
  )
}

ResultsApp.propTypes = {
  tournamentId: PropTypes.number.isRequired,
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('initial-data')
  const props = JSON.parse(node.getAttribute('data'))
  const tournamentId = parseInt(props.tournamentId)
  const root = createRoot(document.getElementById('results-app'))
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/results/:resultsAccessKey" element={<ResultsApp tournamentId={tournamentId} />}/>
      </Routes>
    </BrowserRouter>
  )
})
