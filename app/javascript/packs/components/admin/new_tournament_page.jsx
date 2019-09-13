import React from 'react'
import PropTypes from 'prop-types'

import TournamentFields from '../tournament_management/tournament_fields'
import { createTournament } from './api_client'
import AccessContext from '../util/access_context'

export default class NewTournamentPage extends React.PureComponent {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  static contextType = AccessContext

  render() {
    return (
      <div>
        <div className="title">Uusi turnaus</div>
        <div className="tournament-management__section">
          <TournamentFields onCancel={this.goToIndex} onSave={this.onSave}/>
        </div>
      </div>
    )
  }

  onSave = (data, callback) => {
    createTournament(this.context, data, (errors, response) => {
      if (errors) {
        callback(errors)
      } else {
        this.goToTournamentPage(response.id)
      }
    })
  }

  goToTournamentPage = id => {
    this.props.history.push(`/admin/tournaments/${id}`)
  }

  goToIndex = () => {
    this.props.history.push('/admin')
  }
}
