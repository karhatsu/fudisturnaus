import React from 'react'
import PropTypes from 'prop-types'

export default class TournamentPage extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      tournament: undefined
    }
  }

  render() {
    const { tournament } = this.state
    if (!tournament) {
      return <div>Loading...</div>
    }
    const { name } = tournament
    return (
      <div>
        {name}
      </div>
    )
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props
    fetch(`/api/v1/tournaments/${id}`)
      .then(response => response.json())
      .then(json => this.setState({ tournament: json.tournament }))
      .catch(console.error) // eslint-disable-line no-console
  }
}
