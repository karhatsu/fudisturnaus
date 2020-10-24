import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import '../styles/application.scss'
import Index from './index'
import TournamentPage, { officialLevels } from './tournament_page'
import PropTypes from 'prop-types'
import Match from './match'
import Info from './info'

export default class Main extends React.PureComponent {
  render() {
    return (
      <div>
        <Route path="/info" component={Info}/>
        <Route path="/tournaments/:key" component={TournamentPageWrapper} />
        <Route path="/" exact component={Index} />
      </div>
    )
  }
}

class TournamentPageWrapper extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        key: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  render() {
    const { match: { params: { key } } } = this.props
    return (
      <TournamentPage
        {...this.props}
        officialLevel={officialLevels.none}
        renderMatch={props => <Match {...props}/>}
        tournamentKey={key}
      />
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
