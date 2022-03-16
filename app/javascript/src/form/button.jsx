import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

const Button = ({ disabled, label, onClick, size, type }) => {
  const inputType = () => {
    return type === 'primary' ? 'submit' : 'button'
  }

  const classNames = () => {
    const classes = ['button']
    if (size === 'small') classes.push('button--small')
    if (type === 'primary') classes.push('button--primary')
    else if (type === 'danger') classes.push('button--danger')
    return classes.join(' ')
  }

  const handleClick = useCallback(event => {
    event.preventDefault()
    onClick()
  }, [onClick])

  return <input type={inputType()} value={label} onClick={handleClick} className={classNames()} disabled={disabled}/>
}

Button.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small']),
  type: PropTypes.oneOf(['primary', 'normal', 'danger']).isRequired,
}

export default Button
