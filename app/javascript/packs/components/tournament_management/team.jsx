import React from 'react'
import PropTypes from 'prop-types'
import { createClub, deleteTeam, saveTeam } from './api_client'
import AccessContext from '../util/access_context'

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

  static contextType = AccessContext

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
    this.nameFieldRed = React.createRef()
    this.clubNameFieldRed = React.createRef()
  }

  render() {
    const { formOpen, form: { clubId } } = this.state
    return (
      <div className="tournament-item">
        {formOpen && this.renderForm()}
        {!formOpen && this.renderName()}
        {clubId === NEW_CLUB_ID && this.renderClubForm()}
      </div>
    )
  }

  renderName() {
    const { team } = this.props
    const text = team ? team.name : '+ Lisää uusi joukkue'
    return <div className="tournament-item__title"><span onClick={this.editTeam}>{text}</span></div>
  }

  renderForm() {
    const { errors, form: { clubId, groupId, name } } = this.state
    return (
      <div className="form form--horizontal">
        {errors.length > 0 && <div className="form-error">{errors.join('. ')}.</div>}
        <div className="tournament-item__form">
          <div className="form__field">
            <select onChange={this.changeValue('groupId')} value={groupId}>
              <option>Lohko</option>
              {this.props.groups.map(group => {
                const { id, name, ageGroupName } = group
                return <option key={id} value={id}>{name} ({ageGroupName})</option>
              })}
            </select>
          </div>
          <div className="form__field">
            <select onChange={this.changeValue('clubId')} value={clubId}>
              <option value={CHOOSE_CLUB_ID}>Seura</option>
              <option value={NEW_CLUB_ID}>+ Lisää uusi seura</option>
              {this.props.clubs.map(club => {
                const { id, name } = club
                return <option key={id} value={id}>{name}</option>
              })}
            </select>
          </div>
          <div className="form__field">
            <input ref={this.nameFieldRed} type="text" onChange={this.changeValue('name')} value={name} placeholder="Esim. FC Kontu Valkoinen"/>
          </div>
          <div className="form__buttons">
            <input type="submit" value="Tallenna" onClick={this.submit} className="button button--primary" disabled={!this.canSubmit()}/>
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
            ref={this.clubNameFieldRed}
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
    const { team } = this.props
    this.setState({
      formOpen: true,
      form: {
        clubId: team ? team.club.id : CHOOSE_CLUB_ID,
        groupId: team ? team.group.id : -1,
        name: team ? team.name : '',
      },
    })
  }

  changeValue = field => event => {
    const { form } = this.state
    const value = event.target.value
    this.setState({ form: { ...form, [field]: value } }, () => {
      if (field === 'clubId') {
        if (value === NEW_CLUB_ID && this.clubNameFieldRed) {
          this.clubNameFieldRed.current.focus()
        } else if (value !== NEW_CLUB_ID && this.nameFieldRed) {
          this.nameFieldRed.current.focus()
        }
      }
    })
  }

  setClubName = event => {
    this.setState({ clubName: event.target.value })
  }

  canSubmit = () => {
    const { form: { clubId, groupId, name } } = this.state
    return clubId > 0 && groupId > 0 && !!name
  }

  submit = () => {
    const { team, onTeamSave, tournamentId } = this.props
    saveTeam(this.context, tournamentId, team ? team.id : undefined, this.state.form, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onTeamSave(data)
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
        if (this.nameFieldRed) {
          this.nameFieldRed.current.focus()
        }
      }
    })
  }

  closeClubForm = () => {
    const { form } = this.state
    this.setState({ clubName: '', form: { ...form, clubId: CHOOSE_CLUB_ID } })
  }
}
