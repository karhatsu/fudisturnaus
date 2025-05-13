import React from 'react'

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

export default IdNameSelect
