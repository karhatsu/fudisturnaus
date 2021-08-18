import React from 'react'
import PropTypes from 'prop-types'

export default class Team extends React.PureComponent {
  static propTypes = {
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

  render() {
    const { name } = this.props
    const club = this.findClub()
    return (
      <span className={this.resolveClassNames()}>
        {this.renderLogo(club)}
        <span className="team__name">{name}</span>
      </span>
    )
  }

  findClub = () => {
    const { clubId, club, clubs } = this.props
    if (club) return club
    return clubs.find(c => c.id === clubId)
  }

  resolveClassNames = () => {
    const { selected } = this.props
    const classNames = ['team']
    if (selected) {
      classNames.push('team--selected')
    }
    return classNames.join(' ')
  }

  renderLogo(club) {
    if (club && club.logoUrl) {
      return <img src={club.logoUrl} className="team__logo"/>
    }
  }
}
