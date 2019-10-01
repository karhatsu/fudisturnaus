import React from 'react'
import PropTypes from 'prop-types'

export default class Team extends React.PureComponent {
  static propTypes = {
    clubId: PropTypes.number.isRequired,
    clubs: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      logoUrl: PropTypes.string,
    }),).isRequired,
    name: PropTypes.string.isRequired,
    selected: PropTypes.bool,
  }

  render() {
    const { clubId, clubs, name } = this.props
    const club = clubs.find(c => c.id === clubId)
    return (
      <div className={this.resolveClassNames()}>
        {this.renderLogo(club)}
        <span className="team__name">{name}</span>
      </div>
    )
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
