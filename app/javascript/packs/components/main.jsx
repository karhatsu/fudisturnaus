import React from 'react'
import ReactDOM from 'react-dom'

export default class Main extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      tournaments: undefined
    }
  }

  render() {
    const { tournaments } = this.state
    if (!tournaments) {
      return <div>Loading...</div>
    }
    return (
      <div>
        {!tournaments.length ? 'Ei turnauksia' : tournaments.map(this.renderTournament)}
      </div>
    )
  }

  renderTournament = tournament => {
    const { id, name, start_date } = tournament
    return <div key={id}>{name}, {start_date}</div>
  }

  componentDidMount() {
    fetch('/api/v1/tournaments')
      .then(response => response.json())
      .then(tournaments => this.setState({ tournaments }))
      .catch(console.error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Main/>,
    document.getElementById('react-app'),
  )
})
