function Message({ children, type, noMargins, fullPage, style }) {
  const classNames = ['message', `message--${type}`]
  if (noMargins) classNames.push('message--no-margins')
  if (fullPage) classNames.push('message--full-page')
  return (
    <div className={classNames.join(' ')} style={style}>
      {children}
    </div>
  )
}

export default Message
