import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import Index from './index'
import TournamentPage from './tournament_page'
import './application.scss'

export default class Main extends React.PureComponent {
  render() {
    return (
      <div>
        <Route path="/tournaments/:id" component={TournamentPage} />
        <Route path="/" exact component={Index} />
      </div>
    )
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
