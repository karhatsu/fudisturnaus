import React from 'react'
import PropTypes from 'prop-types'

const FormErrors = ({ errors }) => {
  if (!errors.length) {
    return null
  }
  return <div className="form-error">{errors.join('. ')}{errors.length > 1 ? '.' : ''}</div>
}

FormErrors.propTypes = {
  errors: PropTypes.array.isRequired,
}

export default FormErrors
