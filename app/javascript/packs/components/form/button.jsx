import React from 'react'
import PropTypes from 'prop-types'

export default class Button extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['primary', 'normal', 'danger']).isRequired,
  }

  render() {
    const { disabled, label, onClick } = this.props
    return <input type={this.inputType()} value={label} onClick={onClick} className={this.classNames()} disabled={disabled}/>
  }

  inputType = () => {
    return this.props.type === 'primary' ? 'submit' : 'button'
  }

  classNames = () => {
    switch (this.props.type) {
      case 'primary':
        return 'button button--primary'
      case 'danger':
        return 'button button--danger'
      default:
        return 'button'
    }
  }
}
