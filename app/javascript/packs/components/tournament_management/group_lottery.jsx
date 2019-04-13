import React from 'react'
import PropTypes from 'prop-types'
import { getName } from '../util/util'
import { saveLottery } from './api_client'
import AccessContext from '../util/access_context'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'

export default class GroupLottery extends React.PureComponent {
  static propTypes = {
    ageGroups: PropTypes.array.isRequired,
    group: PropTypes.shape({
      ageGroupId: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      results: PropTypes.arrayOf(PropTypes.shape({
        ranking: PropTypes.number.isRequired,
        teamId: PropTypes.number.isRequired,
        teamName: PropTypes.string.isRequired,
        lot: PropTypes.number,
      })),
    }),
    onLotterySave: PropTypes.func.isRequired,
    tournamentId: PropTypes.number.isRequired,
  }

  static contextType = AccessContext

  constructor(props) {
    super(props)
    this.state = {
      errors: [],
      formOpen: false,
      lots: {},
    }
  }

  render() {
    const { group: { ageGroupId, id, name, results } } = this.props
    const rankingCounts = this.resolveRankingCounts(results)
    return (
      <form key={id}>
        <div className="tournament-management__section-title">{name} ({getName(this.props.ageGroups, ageGroupId)})</div>
        <FormErrors errors={this.state.errors}/>
        <div className="group-results__group">
          <table>
            <thead>
              <tr>
                <th>Sijoitus</th>
                <th className="group-results__team-name">Joukkue</th>
                <th>Arvonnan tulos</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => this.renderGroupResultRow(results, result, index, rankingCounts))}
            </tbody>
          </table>
        </div>
        {this.renderButtons()}
      </form>
    )
  }

  renderButtons() {
    if (this.state.formOpen) {
      return (
        <div className="form__buttons">
          <Button label="Tallennan arvonnan tulos" onClick={this.save} type="primary"/>
          <Button label="Peruuta" onClick={this.cancel} type="normal"/>
        </div>
      )
    }
  }

  renderGroupResultRow = (allResults, teamGroupResults, index, rankingCounts) => {
    const { ranking, teamId, teamName, lot } = teamGroupResults
    const rankingText = index > 0 && ranking === allResults[index - 1].ranking ? '' : `${ranking}.`
    return (
      <tr key={teamId}>
        <td>{rankingText}</td>
        <td className="group-results__team-name">{teamName}</td>
        <td>{rankingCounts[ranking] > 1 || lot || lot === 0 ? this.renderLotField(teamId) : '-'}</td>
      </tr>
    )
  }

  resolveRankingCounts = results => {
    return results.map(result => result.ranking).reduce((counts, ranking) => {
      counts[ranking] = counts[ranking] || 0
      counts[ranking]++
      return counts
    }, {})
  }

  renderLotField(teamId) {
    if (this.state.formOpen) {
      return <TextField onChange={this.setLot(teamId)} placeholder="Esim. 0 tai 1" type="number" value={this.state.lots[teamId] || ''}/>
    }
    const lot = this.props.group.results.find(result => result.teamId === teamId).lot
    const text = lot || lot === 0 ? `Arpa: ${lot}` : 'Aseta arpa'
    return <a href="#" onClick={this.openForm}>{text}</a>
  }

  setLot(teamId) {
    return event => {
      this.setState({ lots: { ...this.state.lots, [teamId]: event.target.value } })
    }
  }

  openForm = (e) => {
    e.preventDefault()
    const lots = {}
    this.props.group.results.forEach(result => {
      lots[result.teamId] = result.lot === 0 ? '0' : result.lot
    })
    this.setState({ errors: [], formOpen: true, lots })
  }

  cancel = () => {
    this.setState({ errors: [], formOpen: false })
  }

  save = () => {
    const { group, onLotterySave, tournamentId } = this.props
    saveLottery(this.context, tournamentId, group.id, this.state.lots, (errors, data) => {
      if (errors) {
        this.setState({ errors })
      } else {
        this.setState({ formOpen: false, errors: [] })
        onLotterySave(group.id, data)
      }
    })
  }
}
