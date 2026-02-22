import { formatTournamentDates } from '../util/date_util'

const TournamentSubTitle = ({ tournament }) => {
  if (!tournament) return null
  const { address, location, startDate, endDate } = tournament

  const renderLocation = () => {
    const googleMapsUrl = address ? `https://www.google.com/maps/place/${address.split(' ').join('+')}` : undefined
    return googleMapsUrl ? (
      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="sub-title__location">
        {location}
      </a>
    ) : (
      location
    )
  }

  return (
    <div className="sub-title">
      {renderLocation()}, {formatTournamentDates(startDate, endDate)}
    </div>
  )
}

export default TournamentSubTitle
