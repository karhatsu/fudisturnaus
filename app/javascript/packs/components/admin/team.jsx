import React from 'react'
import PropTypes from 'prop-types'
import { createClub, deleteTeam, saveTeam } from './api-client'
import AdminSessionKeyContext from './session_key_context'

const CHOOSE_CLUB_ID = '-1'
const NEW_CLUB_ID = '-2'

export default class Team extends React.PureComponent {
  static propTypes = {
    clubs: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    groups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    team: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      club: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      group: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        ageGroupName: PropTypes.string.isRequired,
      }).isRequired,
    }),
    onClubSave: PropTypes.func.isRequired,
    onTeamDelete: PropTypes.func,
    onTeamSave: PropTypes.func.isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  static contextType = AdminSessionKeyContext

  constructor(props) {
    super(props)
    this.state = {
      formOpen: false,
      form: {
        clubId: CHOOSE_CLUB_ID,
        groupId: undefined,
        name: undefined,
      },
      errors: [],
      clubName: '',
    }
  }

  render() {
    const { formOpen, form: { clubId } } = this.state
    return (
      <div className="admin-item">
        {formOpen && this.renderForm()}
        {!formOpen && this.renderName()}
        {clubId === NEW_CLUB_ID && this.renderClubForm()}
      </div>
    )
  }

  renderName() {
    const { team } = this.props
    const text = team ? `${team.name} (${team.group.name}, ${team.group.ageGroupName})` : 'Lisää uusi joukkue'
    return <div className="admin-item__title" onClick={this.editTeam}>{text}</div>
  }

  renderForm() {
    const submitDisabled = this.state.form.clubId <= 0
    return (
      <div className="form form--horizontal">
        {this.state.errors.length > 0 && <div className="form-error">{this.state.errors.join('. ')}.</div>}
        <div className="admin-item__form">
          <div className="form__field">
            <select onChange={this.changeValue('groupId')} value={this.state.form.groupId}>
              {this.props.groups.map(group => {
                const { id, name, ageGroupName } = group
                return <option key={id} value={id}>{name} ({ageGroupName})</option>
              })}
            </select>
          </div>
          <div className="form__field">
            <select onChange={this.changeValue('clubId')} value={this.state.form.clubId}>
              <option value={CHOOSE_CLUB_ID}>- Valitse seura -</option>
              <option value={NEW_CLUB_ID}>- Lisää uusi seura -</option>
              {this.props.clubs.map(club => {
                const { id, name } = club
                return <option key={id} value={id}>{name}</option>
              })}
            </select>
          </div>
          <div className="form__field">
            <input type="text" onChange={this.changeValue('name')} value={this.state.form.name} placeholder="Esim. FC Kontu Valkoinen"/>
          </div>
          <div className="form__buttons">
            <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary" disabled={submitDisabled}/>
            <input type="button" value="Peruuta" onClick={this.cancel} className="button"/>
            {!!this.props.team && <input type="button" value="Poista" onClick={this.delete} className="button button--danger"/>}
          </div>
        </div>
      </div>
    )
  }

  renderClubForm() {
    return (
      <div className="form form--horizontal new-club-form">
        <div className="form__field">
          <input
            type="text"
            onChange={this.setClubName}
            value={this.state.clubName}
            placeholder="Seuran nimi (tarkasta oikeinkirjoitus)"
          />
        </div>
        <div className="form__buttons">
          <input type="submit" value="Lisää uusi seura" onClick={this.saveClub} className="button button--primary"/>
          <input type="button" value="Peruuta" onClick={this.closeClubForm} className="button"/>
        </div>
      </div>
    )
  }

  editTeam = () => {
    const { groups, team } = this.props
    this.setState({
      formOpen: true,
      form: {
        clubId: team ? team.club.id : CHOOSE_CLUB_ID,
        groupId: team ? team.group.id : groups[0].id,
        name: team ? team.name : '',
      },
    })
  }

  changeValue = field => event => {
    const { form } = this.state
    this.setState({ form: { ...form, [field]: event.target.value } })
  }

  setClubName = event => {
    this.setState({ clubName: event.target.value })
  }

  submit = () => {
    const { team, onTeamSave, tournamentId } = this.props
    saveTeam(this.context, tournamentId, team ? team.id : undefined, this.state.form, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onTeamSave(data.id, data)
      }
    })
  }

  cancel = () => {
    this.setState({ formOpen: false, errors: [] })
  }

  delete = () => {
    const { team: { id }, onTeamDelete, tournamentId } = this.props
    deleteTeam(this.context, tournamentId, id, (errors) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onTeamDelete(id)
      }
    })
  }

  saveClub = () => {
    createClub(this.context, this.state.clubName, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        const { form } = this.state
        this.setState({ errors: [], clubName: '', form: { ...form, clubId: data.id } })
        this.props.onClubSave(data)
      }
    })
  }

  closeClubForm = () => {
    const { form } = this.state
    this.setState({ clubName: '', form: { ...form, clubId: CHOOSE_CLUB_ID } })
  }
}
