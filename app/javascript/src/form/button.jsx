import React from 'react'
import PropTypes from 'prop-types'

export default class Button extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small']),
    type: PropTypes.oneOf(['primary', 'normal', 'danger']).isRequired,
  }

  render() {
    const { disabled, label } = this.props
    return <input type={this.inputType()} value={label} onClick={this.onClick} className={this.classNames()} disabled={disabled}/>
  }

  inputType = () => {
    return this.props.type === 'primary' ? 'submit' : 'button'
  }

  classNames = () => {
    const { size, type } = this.props
    const classes = ['button']
    if (size === 'small') classes.push('button--small')
    if (type === 'primary') classes.push('button--primary')
    else if (type === 'danger') classes.push('button--danger')
    return classes.join(' ')
  }

  onClick = event => {
    event.preventDefault()
    this.props.onClick()
  }
}
