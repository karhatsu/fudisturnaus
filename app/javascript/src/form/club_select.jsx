import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
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
    if (clubId === null) setSearch('')
  }, [onChange])

  const closeList = useCallback(() => {
    const club = clubs.find(c => c.name === search)
    onChange(club?.id)
    setShowList(false)
  }, [clubs, search, onChange])

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
      {showList && <div className="club-select__background" onClick={closeList} />}
      <input
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setShowList(true)}
        placeholder={clubId === null ? '- Ei virallista seuraa -' : 'Seura'}
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
          <div onClick={() => selectClub(null)} className="club-select__option">- Ei virallista seuraa -</div>
          {visibleClubs.map(c => (
            <div key={c.id} onClick={() => selectClub(c.id)} className="club-select__option" id={`club_${c.id}`}>
              {c.name}{c.alias ? ` (${c.alias})` : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

ClubSelect.displayName = 'ClubSelect'

export default ClubSelect
