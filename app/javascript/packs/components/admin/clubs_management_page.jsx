import React from 'react'
import AccessContext from '../util/access_context'
import { fetchClubs, refreshCache } from './api_client'
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
      cacheRefreshResponse: undefined,
    }
  }

  render() {
    return (
      <div>
        <Title iconLink="/admin" loading={!this.state.clubs.length} text="Seurat"/>
        <div className="tournament-management__section">
          <FormErrors errors={this.state.errors}/>
          {this.state.clubs.map(club => <ClubForm key={club.id} club={club} onClubDelete={this.onClubDelete} onClubSave={this.onClubSave}/>)}
        </div>
        <div className="title-2">Cache refresh</div>
        {this.renderCacheSection()}
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

  onClubDelete = id => {
    const clubs = [...this.state.clubs]
    const clubIndex = clubs.findIndex(club => club.id === id)
    clubs.splice(clubIndex, 1)
    this.setState({ clubs })
  }

  onClubSave = data => {
    const clubs = [...this.state.clubs]
    const clubIndex = clubs.findIndex(club => club.id === data.id)
    clubs[clubIndex] = { ...clubs[clubIndex], ...data }
    this.setState({ clubs: clubs.sort((a, b) => a.name.localeCompare(b.name) ) })
  }

  renderCacheSection() {
    const { cacheRefreshResponse } = this.state
    const messageType = cacheRefreshResponse === 'Done' ? 'success' : (cacheRefreshResponse ? 'error' : undefined)
    return (
      <div className="tournament-management__section">
        {cacheRefreshResponse && <div className={`message message--${messageType}`}>{cacheRefreshResponse}</div>}
        <a href="#" onClick={this.refreshCache}>Refresh cache</a>
      </div>
    )
  }

  refreshCache = event => {
    event.preventDefault()
    refreshCache(this.context, errors => {
      if (errors) {
        this.setState({ cacheRefreshResponse: errors })
      } else {
        this.setState({ cacheRefreshResponse: 'Done' })
        setTimeout(() => {
          this.setState({ cacheRefreshResponse: undefined })
        }, 3000)
      }
    })
  }
}
