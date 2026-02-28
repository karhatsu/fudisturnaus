import { isAfter, isBefore, startOfDay, subDays } from 'date-fns'
import { toTzDate } from '../util/date_util'
import { pricePerTeam } from '../util/util'
import Button from '../form/button'

const cancelThresholdDays = 2

const cancelInfo = `Premium-version voi peruuttaa ${cancelThresholdDays} päivää ennen turnauksen alkua.`
const pricingInfo = `Premium-versio maksaa ${pricePerTeam} € / osallistuva joukkue (sis. alv). Laskun eräpäivä on viikko turnauksen jälkeen.`
const premiumInUse = `Teillä on käytössä palvelun premium-versio, jossa turnaussivulla ei näytetä mainoksia. ${cancelInfo} ${pricingInfo}`
const premiumNotInUse = `Premium-versiossa turnaussivulla ei näytetä mainoksia. ${cancelInfo} ${pricingInfo}`

const resolveDateStatus = (tournament) => {
  const { startDate, endDate } = tournament
  const today = startOfDay(toTzDate(new Date()))
  const cancelDeadline = subDays(toTzDate(startDate), cancelThresholdDays)
  if (isBefore(today, cancelDeadline)) return 'upcoming'
  if (isAfter(today, toTzDate(endDate))) return 'past'
  return 'ongoing'
}

const PremiumSection = ({ tournament, onSelectPremium, errors }) => {
  const { premium } = tournament
  const dateStatus = resolveDateStatus(tournament)

  if (dateStatus === 'past' && !premium) return

  const canTogglePremium = !premium || dateStatus === 'upcoming'

  const togglePremium = () => {
    if (premium) return <Button label="Peruuta premium-tilaus" onClick={onSelectPremium(false)} />
    return <Button label="Tilaa premium" type="primary" onClick={onSelectPremium(true)} />
  }

  const description = () => {
    if (dateStatus === 'past') return pricingInfo
    if (premium) return premiumInUse
    return premiumNotInUse
  }

  return (
    <div>
      <div className="title-2">Premium</div>
      <div className="tournament-management__section">
        {errors && <div className="tournament-item error">{errors.join('. ')}.</div>}
        {canTogglePremium && <div className="tournament-item">{togglePremium()}</div>}
        <div className="tournament-item">{description()}</div>
      </div>
    </div>
  )
}

export default PremiumSection
