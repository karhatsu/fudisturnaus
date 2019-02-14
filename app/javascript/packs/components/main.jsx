import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import Index from './index'
import TournamentPage from './tournament_page'
import './styles/application.scss'
import PropTypes from 'prop-types'

export default class Main extends React.PureComponent {
  render() {
    return (
      <div>
        <Route path="/tournaments/:id" component={TournamentPageWrapper} />
        <Route path="/" exact component={Index} />
      </div>
    )
  }
}

class TournamentPageWrapper extends React.PureComponent {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const { location: { search }, match: { params: { id } } } = this.props
    return <TournamentPage tournamentId={parseInt(id)} showGroupTables={search === '?t=1'}/>
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BrowserRouter>
      <Route path="/" component={Main} />
    </BrowserRouter>,
    document.getElementById('react-app'),
  )
})
