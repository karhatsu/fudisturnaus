import React from 'react'
import PropTypes from 'prop-types'

const Team = props => {
  const { clubId, clubs, name, selected } = props

  const club = props.club ? props.club : clubs.find(c => c.id === clubId)

  const resolveClassNames = () => {
    const classNames = ['team']
    if (selected) {
      classNames.push('team--selected')
    }
    return classNames.join(' ')
  }

  const renderLogo = () => {
    if (club && club.logoUrl) {
      return <img src={club.logoUrl} className="team__logo"/>
    }
  }

  return (
    <span className={resolveClassNames()}>
      {renderLogo()}
      <span className="team__name">{name}</span>
    </span>
  )
}

Team.propTypes = {
  clubId: PropTypes.number,
  club: PropTypes.shape({
    id: PropTypes.number.isRequired,
    logoUrl: PropTypes.string,
  }),
  clubs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    logoUrl: PropTypes.string,
  })),
  name: PropTypes.string.isRequired,
  selected: PropTypes.bool,
}

export default Team
