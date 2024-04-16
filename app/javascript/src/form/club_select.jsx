import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { getName } from '../util/util'
import { filterClubs } from '../util/club_util'

export const NEW_CLUB_ID = '-2'
export const CHOOSE_CLUB_ID = '-1'

const ClubSelect = forwardRef(({ clubId, clubs, onChange, showNewClub, initialSearch = '' }, ref) => {
  const [showList, setShowList] = useState(false)
  const [search, setSearch] = useState(initialSearch)

  const visibleClubs = useMemo(() => filterClubs(clubs, search), [clubs, search])

  const selectClub = useCallback(clubId => {
    onChange(clubId)
    setShowList(false)
  }, [onChange])

  useEffect(() => {
    if (clubId === CHOOSE_CLUB_ID && initialSearch) {
      setShowList(true)
      return
    }
    const clubName = getName(clubs, parseInt(clubId), '')
    setSearch(clubName)
  }, [clubId, clubs, initialSearch])

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
  initialSearch: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  showNewClub: PropTypes.bool,
}

export default ClubSelect
