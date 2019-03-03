import React from 'react'
import PropTypes from 'prop-types'
import { fetchTournament } from '../api-client'
import Title from '../title'
import Field from './field'

export default class AdminTournamentPage extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    sessionKey: PropTypes.string.isRequired,
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
        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    if (!this.state.tournament) return null
    return (
      <div>
        <div className="title-2">Kentät</div>
        {this.renderFields()}
      </div>
    )
  }

  componentDidMount() {
    this.fetchTournamentData()
  }

  fetchTournamentData = () => {
    const { match: { params: { id } } } = this.props
    fetchTournament(id, (err, tournament) => {
      if (tournament) {
        this.setState({ tournament })
      } else if (err && !this.state.tournament) {
        this.setState({ error: true })
      }
    })
  }

  renderFields() {
    const { tournament: { fields } } = this.state
    return fields.map(field => {
      return <Field key={field.id} field={field} onSuccessfulSave={this.onSuccessfulFieldSave} sessionKey={this.props.sessionKey}/>
    })
  }

  onSuccessfulFieldSave = data => {
    const { id, name } = data
    const fields = [...this.state.tournament.fields]
    const fieldIndex = fields.findIndex(field => field.id === id)
    fields[fieldIndex] = { ...fields[fieldIndex], name }
    this.setState({ tournament: { ...this.state.tournament, fields } })
  }
}
