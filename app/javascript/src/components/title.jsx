import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const emoji = '⚽'

const buildEventJson = tournament => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: tournament.name,
  startDate: tournament.startDate,
  endDate: tournament.endDate,
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: tournament.cancelled ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
  location: {
    '@type': 'Place',
    name: tournament.location,
    address: {
      '@type': 'PostalAddress',
      streetAddress: tournament.address,
      addressCountry: 'FI',
    },
  },
  image: [
    'https://www.fudisturnaus.com/logo.jpg'
  ],
  description: 'Jalkapalloturnaus',
  organizer: {
    '@type': 'Organization',
    name: tournament.club?.name,
  },
})

const Title = ({ children, club, iconLink, loading, text, tournament }) => {
  useEffect(() => {
    document.title = text.indexOf('fudisturnaus.com') !== -1 ? text : `${text} - fudisturnaus.com`
  }, [text])

  useEffect(() => {
    const eventElement = document.getElementById('event-data-json')
    let event = ''
    if (tournament) {
      event = JSON.stringify(buildEventJson(tournament))
    }
    eventElement.innerText = event
  }, [tournament])

  const resolveEmojiClasses = () => {
    const emojiClasses = ['title__emoji']
    if (loading) {
      emojiClasses.push('title__emoji--loading')
    }
    return emojiClasses.join(' ')
  }

  const renderEmoji = () => {
    const emojiClasses = resolveEmojiClasses()
    if (!iconLink) {
      return <span className={emojiClasses}>{emoji}</span>
    } else {
      return <Link to={iconLink} className={emojiClasses}>{emoji}</Link>
    }
  }

  const renderClubLogo = () => {
    if (club && club.logoUrl) {
      return <img src={club.logoUrl} className="title__club-logo" />
    }
  }

  return (
    <div className="title">
      <div className="title__main">
        {renderEmoji()}
        <span className="title__text">{text}</span>
        {renderClubLogo()}
      </div>
      <div className="title__extra">
        {children}
      </div>
    </div>
  )
}

Title.propTypes = {
  children: PropTypes.element,
  club: PropTypes.shape({
    logoUrl: PropTypes.string,
  }),
  iconLink: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  tournament: PropTypes.object,
}

export default Title
