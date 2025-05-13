import React from 'react'

const Team = props => {
  const { clubId, clubs, name, selected, showAlias } = props

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
      <span className="team__name">{name}{showAlias && club.alias && ` (${club.alias})`}</span>
    </span>
  )
}

export default Team
