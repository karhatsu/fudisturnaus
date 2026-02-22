import { getUserTimeZone, isDefaultTimeZone } from '../util/date_util'
import Message from './message'

const TimezoneWarning = () => {
  if (!isDefaultTimeZone()) {
    return (
      <Message type="warning">
        Turnauksen kaikki ajat ovat Suomen aikavyöhykkeen aikoja. Koneesi aikavyöhyke on {getUserTimeZone()}.
      </Message>
    )
  }
}

export default TimezoneWarning
