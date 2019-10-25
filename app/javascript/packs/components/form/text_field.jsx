import React from 'react'
import PropTypes from 'prop-types'

const TextField = React.forwardRef((props, ref) => {
  const { containerClass, field, label, onChange, placeholder, type, value } = props
  return (
    <div className={`form__field ${containerClass}`}>
      {!!label && <div className="label">{label}</div>}
      <input ref={ref} id={field} type={type} onChange={onChange} value={value} placeholder={placeholder}/>
    </div>
  )
})

TextField.propTypes = {
  containerClass: PropTypes.string,
  field: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(['date', 'number', 'password', 'text']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

TextField.defaultProps = {
  containerClass: '',
  type: 'text',
}

TextField.displayName = 'TextField'

export default TextField
