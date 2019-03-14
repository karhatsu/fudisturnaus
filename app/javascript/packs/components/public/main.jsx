import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import '../styles/application.scss'
import Index from './index'
import TournamentPage from './tournament_page'
import PropTypes from 'prop-types'
import Match from './match'

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
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  render() {
    const { match: { params: { id } } } = this.props
    return <TournamentPage editable={false} official={false} renderMatch={props => <Match {...props}/>} tournamentId={parseInt(id)}/>
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
