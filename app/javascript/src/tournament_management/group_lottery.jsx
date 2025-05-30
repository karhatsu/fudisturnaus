import React, { useContext } from 'react'
import { getName } from '../util/util'
import { saveLottery } from './api_client'
import AccessContext from '../util/access_context'
import FormErrors from '../form/form_errors'
import TextField from '../form/text_field'
import Button from '../form/button'
import useForm from '../util/use_form'

const GroupLottery = ({ ageGroups, group, onLotterySave, tournamentId }) => {
  const accessContext = useContext(AccessContext)
  const { formOpen, data, errors, setErrors, openForm, closeForm, changeValue } = useForm()

  const renderButtons = () => {
    if (formOpen) {
      return (
        <div className="form__buttons">
          <Button label="Tallennan arvonnan tulos" onClick={save} type="primary"/>
          <Button label="Peruuta" onClick={closeForm} type="normal"/>
        </div>
      )
    }
  }

  const renderGroupResultRow = (allResults, teamGroupResults, index, rankingCounts) => {
    const { ranking, teamId, teamName, lot } = teamGroupResults
    const rankingText = index > 0 && ranking === allResults[index - 1].ranking ? '' : `${ranking}.`
    return (
      <tr key={teamId}>
        <td>{rankingText}</td>
        <td className="group-results__team-name">{teamName}</td>
        <td>{rankingCounts[ranking] > 1 || lot || lot === 0 ? renderLotField(teamId) : '-'}</td>
      </tr>
    )
  }

  const resolveRankingCounts = results => {
    return results.map(result => result.ranking).reduce((counts, ranking) => {
      counts[ranking] = counts[ranking] || 0
      counts[ranking]++
      return counts
    }, {})
  }

  const renderLotField = (teamId) => {
    if (formOpen) {
      return <TextField onChange={setLot(teamId)} placeholder="Esim. 0 tai 1" type="number" value={data[teamId] || ''}/>
    }
    const lot = group.results.find(result => result.teamId === teamId).lot
    const text = lot || lot === 0 ? `Arpa: ${lot}` : 'Aseta arpa'
    return <a href="#" onClick={onOpenClick}>{text}</a>
  }

  const setLot = (teamId) => event => changeValue(teamId, event.target.value)

  const onOpenClick = e => {
    e.preventDefault()
    const lots = {}
    group.results.forEach(result => {
      lots[result.teamId] = result.lot === 0 ? '0' : result.lot
    })
    openForm(lots)
  }

  const save = () => {
    saveLottery(accessContext, tournamentId, group.id, data, (errors, data) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
        onLotterySave(group.id, data)
      }
    })
  }

  const { ageGroupId, id, name, results } = group
  const rankingCounts = resolveRankingCounts(results)
  return (
    <form key={id}>
      <div className="tournament-management__section-title">{name} ({getName(ageGroups, ageGroupId)})</div>
      <FormErrors errors={errors}/>
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
            {results.map((result, index) => renderGroupResultRow(results, result, index, rankingCounts))}
          </tbody>
        </table>
      </div>
      {renderButtons()}
    </form>
  )
}

export default GroupLottery
