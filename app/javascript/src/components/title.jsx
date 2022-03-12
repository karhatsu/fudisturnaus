import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const emoji = '⚽'

const Title = ({ children, club, iconLink, loading, text }) => {
  useEffect(() => {
    document.title = text.indexOf('fudisturnaus.com') !== -1 ? text : `${text} - fudisturnaus.com`
  }, [text])

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
      <div>
        {renderEmoji()}
        <span className="title__text">{text}</span>
        {renderClubLogo()}
      </div>
      {children}
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
}

export default Title
