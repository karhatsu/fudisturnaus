import React from 'react'
import PropTypes from 'prop-types'

export default class IdNameSelect extends React.PureComponent {
  static propTypes = {
    customNameBuild: PropTypes.func,
    field: PropTypes.string.isRequired,
    formData: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const { field, formData, label, onChange } = this.props
    return (
      <div className="form__field">
        <select onChange={onChange} value={formData[field]}>
          <option>{label}</option>
          {this.renderOptions()}
        </select>
      </div>
    )
  }

  renderOptions() {
    const { customNameBuild, items } = this.props
    const nameBuild = customNameBuild || (item => item.name)
    return items.map(item => {
      const { id } = item
      return <option key={id} value={id}>{nameBuild(item)}</option>
    })
  }
}
