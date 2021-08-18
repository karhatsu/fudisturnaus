import PropTypes from 'prop-types'

export const idNamePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
})
