import React from 'react'
import PropTypes from 'prop-types'

export default class FormErrors extends React.PureComponent {
  static propTypes = {
    errors: PropTypes.array.isRequired,
  }

  render() {
    const { errors } = this.props
    if (!errors.length) {
      return null
    }
    return <div className="form-error">{errors.join('. ')}{errors.length > 1 ? '.' : ''}</div>
  }
}
