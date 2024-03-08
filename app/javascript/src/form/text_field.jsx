import React from 'react'
import PropTypes from 'prop-types'

const TextField = React.forwardRef((props, ref) => {
  const { containerClass, field, label, onBlur, onChange, placeholder, type, value } = props
  return (
    <div className={`form__field ${containerClass}`}>
      {!!label && <div className="label">{label}</div>}
      <input ref={ref} id={field} type={type} onBlur={onBlur} onChange={onChange} value={value} placeholder={placeholder}/>
    </div>
  )
})

TextField.propTypes = {
  containerClass: PropTypes.string,
  field: PropTypes.string,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(['date', 'email', 'number', 'password', 'text']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

TextField.defaultProps = {
  containerClass: '',
  type: 'text',
}

TextField.displayName = 'TextField'

export default TextField
