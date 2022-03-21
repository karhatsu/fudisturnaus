import React from 'react'
import PropTypes from 'prop-types'
import Referee from './referee'

const Referees = ({ onItemDelete, onItemSave, tournament, tournamentId }) => {
  const { referees } = tournament

  const renderInfo = () => {
    return (
      <div className="tournament-item">
        Jos turnauksessa on paljon otteluita, voit helpottaa tuomareiden toimintaa nimeämällä jokaiseen otteluun
        tuomarin. Näin jokainen tuomari saa oman linkin, jonka kautta hän pääsee helposti näkemään vain omat ottelunsa
        sekä syöttämään niiden tulokset.
      </div>
    )
  }

  const renderReferees = () => {
    return referees.map(referee => {
      return (
        <Referee
          key={referee.id}
          onRefereeDelete={onItemDelete('referees')}
          onRefereeSave={onItemSave('referees')}
          referee={referee}
          tournamentId={tournamentId}
        />
      )
    })
  }

  return (
    <>
      <div className="title-2">Tuomarit</div>
      <div className="tournament-management__section tournament-management__section--referees">
        {!referees.length && renderInfo()}
        {renderReferees()}
        <Referee onRefereeSave={onItemSave('referees')} tournamentId={tournamentId} />
      </div>
    </>
  )
}

Referees.propTypes = {
  onItemDelete: PropTypes.func.isRequired,
  onItemSave: PropTypes.func.isRequired,
  tournament: PropTypes.shape({
    referees: PropTypes.array.isRequired,
  }).isRequired,
  tournamentId: PropTypes.number.isRequired,
}

export default Referees
