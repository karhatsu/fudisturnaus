import React from 'react'
import PropTypes from 'prop-types'

export default class VisibilityBadge extends React.PureComponent {
  static propTypes = {
    visibility: PropTypes.oneOf([0, 1, 2]).isRequired,
  }

  render() {
    const { visibility } = this.props
    return <div className={`badge badge--${visibility}`}>{this.resolveText(visibility)}</div>
  }

  resolveText = visibility => {
    switch (visibility) {
      case 0:
        return 'Vain perustiedot julkaistu'
      case 1:
        return 'Sarjat ja joukkueet julkaistu'
      case 2:
        return 'Koko otteluohjelma julkaistu'
    }
  }
}
