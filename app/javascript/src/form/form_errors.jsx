import React from 'react'

const FormErrors = ({ errors }) => {
  if (!errors.length) {
    return null
  }
  return <div className="form-error">{errors.join('. ')}{errors.length > 1 ? '.' : ''}</div>
}

export default FormErrors
