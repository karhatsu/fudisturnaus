import React from 'react'
import AccessContext from '../util/access_context'
import { fetchClubs } from './api_client'
import FormErrors from '../form/form_errors'
import ClubForm from './club_form'
import Title from '../components/title'

export default class ClubsManagementPage extends React.PureComponent {
  static contextType = AccessContext

  constructor(props) {
    super(props)
    this.state = {
      clubs: [],
      errors: [],
    }
  }

  render() {
    return (
      <div>
        <Title iconLink="/admin" loading={!this.state.clubs.length} text="Seurat"/>
        <div className="tournament-management__section">
          <FormErrors errors={this.state.errors}/>
          {this.state.clubs.map(club => <ClubForm key={club.id} club={club} onClubSave={this.onClubSave}/>)}
        </div>
      </div>
    )
  }

  componentDidMount() {
    fetchClubs(this.context, (errors, response) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ errors: [], clubs: response.clubs })
      }
    })
  }

  onClubSave = data => {
    const clubs = [...this.state.clubs]
    const clubIndex = clubs.findIndex(club => club.id === data.id)
    clubs[clubIndex] = { ...clubs[clubIndex], ...data }
    this.setState({ clubs: clubs.sort((a, b) => a.name.localeCompare(b.name) ) })
  }
}
