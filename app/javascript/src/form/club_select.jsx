import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { getName } from '../util/util'

export const NEW_CLUB_ID = '-2'
export const CHOOSE_CLUB_ID = '-1'

const ClubSelect = forwardRef(({ clubId, clubs, onChange, showNewClub }, ref) => {
  const [showList, setShowList] = useState(false)
  const [search, setSearch] = useState('')

  const visibleClubs = useMemo(() => {
    const s = search.toLowerCase()
    return clubs.filter(c => c.name.toLowerCase().match(s) || c.alias?.toLowerCase().match(s))
  }, [clubs, search])

  const selectClub = useCallback(clubId => {
    onChange(clubId)
    setShowList(false)
  }, [onChange])

  useEffect(() => {
    const clubName = getName(clubs, parseInt(clubId), '')
    setSearch(clubName)
  }, [clubId, clubs])

  return (
    <div className="club-select">
      {showList && <div className="club-select__background" onClick={() => setShowList(false)} />}
      <input
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setShowList(true)}
        placeholder="Seura"
        ref={ref}
        value={search}
      />
      {showList && (
        <div className="club-select__list">
          {showNewClub && (
            <div onClick={() => selectClub(NEW_CLUB_ID)} className="club-select__option" id="add-new-club">
              + Lisää uusi seura
            </div>
          )}
          {visibleClubs.map(c => (
            <div key={c.id} onClick={() => selectClub(c.id)} className="club-select__option" id={`club_${c.id}`}>{c.name}</div>
          ))}
        </div>
      )}
    </div>
  )
})

ClubSelect.displayName = 'ClubSelect'

ClubSelect.propTypes = {
  clubId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  clubs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  showNewClub: PropTypes.bool,
}

export default ClubSelect
