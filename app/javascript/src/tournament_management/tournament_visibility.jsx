import Button from '../form/button'
import { visibilityTypes } from '../util/enums'
import VisibilityBadge from './visibility_badge'
import useForm from '../util/use_form'
import FormErrors from '../form/form_errors'

const { onlyTitle, teams, all } = visibilityTypes

const TournamentVisibility = (props) => {
  const { tournament, onSave } = props
  const { formOpen, data, errors, setErrors, openForm, closeForm, onFieldChange } = useForm(undefined)

  const renderForm = () => {
    return (
      <form className="form form--vertical">
        {renderVisibilityField()}
        <FormErrors errors={errors} />
        {renderTournamentFormButtons()}
      </form>
    )
  }

  const renderVisibilityField = () => {
    return (
      <div className="form__field">
        <div className="label">Turnauksen näkyvyys</div>
        <div className="">
          <select onChange={onFieldChange('visibility')} value={data.visibility}>
            <option value={onlyTitle}>Turnauksen perustiedot</option>
            <option value={teams}>Turnauksen perustiedot, sarjat ja joukkueet</option>
            <option value={all}>Turnauksen koko otteluohjelma</option>
          </select>
        </div>
      </div>
    )
  }

  const renderTournamentFormButtons = () => {
    return (
      <div className="form__buttons">
        <Button label="Tallenna" onClick={submit} type="primary" />
        <Button label="Peruuta" onClick={closeForm} type="normal" />
      </div>
    )
  }

  const renderVisibility = () => (
    <div className="tournament-item">
      <div className="tournament-item__title tournament-item__title--existing">
        <span onClick={onOpenClick}>
          <VisibilityBadge visibility={tournament.visibility} />
        </span>
      </div>
    </div>
  )

  const onOpenClick = () => {
    const { visibility } = tournament
    openForm({ visibility })
  }

  const submit = () => {
    const trimmedData = { ...data }
    onSave(trimmedData, (errors) => {
      if (errors) {
        setErrors(errors)
      } else {
        closeForm()
      }
    })
  }

  return (
    <div>
      <div className="title-2">Turnauksen julkaisu</div>
      <div className="tournament-management__section">{formOpen ? renderForm() : renderVisibility()}</div>
    </div>
  )
}

export default TournamentVisibility
