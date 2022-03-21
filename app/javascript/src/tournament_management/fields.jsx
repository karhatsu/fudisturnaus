import React from 'react'
import PropTypes from 'prop-types'
import Field from './field'

const Fields = ({ fields, onItemDelete, onItemSave, tournamentId }) => {
  const renderFields = () => {
    return fields.map(field => {
      return <Field
        key={field.id}
        field={field}
        onFieldDelete={onItemDelete('fields')}
        onFieldSave={onItemSave('fields')}
        tournamentId={tournamentId}
      />
    })
  }

  return (
    <>
      <div className="title-2">Kentät</div>
      <div className="tournament-management__section tournament-management__section--fields">
        {renderFields()}
        <Field onFieldSave={onItemSave('fields')} tournamentId={tournamentId}/>
      </div>
    </>
  )
}

Fields.propTypes = {
  fields: PropTypes.array.isRequired,
  onItemDelete: PropTypes.func.isRequired,
  onItemSave: PropTypes.func.isRequired,
  tournamentId: PropTypes.number.isRequired,
}

export default Fields
