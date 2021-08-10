import React from 'react'
import PropTypes from 'prop-types'

function Message({ children, type, noMargins, fullPage, style }) {
  const classNames = ['message', `message--${type}`]
  if (noMargins) classNames.push('message--no-margins')
  if (fullPage) classNames.push('message--full-page')
  return <div className={classNames.join(' ')} style={style}>{children}</div>
}

Message.propTypes = {
  children: PropTypes.string.isRequired,
  fullPage: PropTypes.bool,
  noMargins: PropTypes.bool,
  style: PropTypes.object,
  type: PropTypes.oneOf(['error', 'warning', 'success']).isRequired,
}

export default Message
