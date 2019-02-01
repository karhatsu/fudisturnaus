import React from 'react'
import PropTypes from 'prop-types'

export default class TournamentPage extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  render() {
    const { match: { params: { id } } } = this.props
    return <div>tournament id: {id}</div>
  }
}
