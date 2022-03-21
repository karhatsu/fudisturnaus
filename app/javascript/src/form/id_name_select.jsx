import React from 'react'
import PropTypes from 'prop-types'

const IdNameSelect = ({ customNameBuild, field, formData, items, label, onChange }) => {
  const renderOptions = () => {
    const nameBuild = customNameBuild || (item => item.name)
    return items.map(item => {
      const { id } = item
      return <option key={id} value={id}>{nameBuild(item)}</option>
    })
  }

  return (
    <div className="form__field">
      <select onChange={onChange} value={formData[field] || ''}>
        <option value="">{label}</option>
        {renderOptions()}
      </select>
    </div>
  )
}

IdNameSelect.propTypes = {
  customNameBuild: PropTypes.func,
  field: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default IdNameSelect
