import React from 'react'
import PropTypes from 'prop-types'
import { fetchTournament } from '../api-client'
import Title from '../title'

export default class AdminTournamentPage extends React.PureComponent {
  static propTypes = {
    adminAccessKey: PropTypes.string.isRequired, // TODO: cookie?
    tournamentId: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      error: false,
      tournament: undefined,
    }
  }

  render() {
    const { error, tournament } = this.state
    const title = tournament ? tournament.name : 'fudisturnaus.com'
    return (
      <div>
        <Title loading={!tournament && !error} text={`ADMIN - ${title}`}/>
        <div>TODO</div>
      </div>
    )
  }

  componentDidMount() {
    this.fetchTournamentData()
  }

  fetchTournamentData = () => {
    const { tournamentId } = this.props
    fetchTournament(tournamentId, (err, tournament) => {
      if (tournament) {
        this.setState({ tournament })
      } else if (err && !this.state.tournament) {
        this.setState({ error: true })
      }
    })
  }
}
