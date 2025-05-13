import React from 'react'

const TextField = React.forwardRef((props, ref) => {
  const { containerClass = '', field, label, onBlur, onChange, placeholder, type = 'text', value } = props
  return (
    <div className={`form__field ${containerClass}`}>
      {!!label && <div className="label">{label}</div>}
      <input ref={ref} id={field} type={type} onBlur={onBlur} onChange={onChange} value={value} placeholder={placeholder}/>
    </div>
  )
})

TextField.displayName = 'TextField'

export default TextField
