import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import TournamentPage from './tournament_page'
import './styles/application.scss'

export default class OfficialMain extends React.PureComponent {
  static propTypes = {
    accessKey: PropTypes.string.isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      tournament: undefined,
    }
  }

  render() {
    const { accessKey, tournamentId } = this.props
    return <TournamentPage officialAccessKey={accessKey} tournamentId={tournamentId}/>
  }

  componentDidMount() {
    const { tournamentId } = this.props
    fetch(`/api/v1/tournaments/${tournamentId}`)
      .then(response => response.json())
      .then(tournament => this.setState({ tournament }))
      .catch(console.error) // eslint-disable-line no-console
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('initial-data')
  const props = JSON.parse(node.getAttribute('data'))
  ReactDOM.render(
    <OfficialMain {...props}/>,
    document.getElementById('official-app'),
  )
})
