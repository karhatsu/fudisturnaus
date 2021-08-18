import React from 'react'
import PropTypes from 'prop-types'
import { visibilityTypes } from '../util/enums'

const { onlyTitle, teams, all } = visibilityTypes

export default class VisibilityBadge extends React.PureComponent {
  static propTypes = {
    visibility: PropTypes.oneOf([onlyTitle, teams, all]).isRequired,
  }

  render() {
    const { visibility } = this.props
    return <div className={`badge badge--${visibility}`}>{this.resolveText(visibility)}</div>
  }

  resolveText = visibility => {
    switch (visibility) {
      case onlyTitle:
        return 'Vain perustiedot julkaistu'
      case teams:
        return 'Sarjat ja joukkueet julkaistu'
      case all:
        return 'Koko otteluohjelma julkaistu'
    }
  }
}
