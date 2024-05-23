import React from 'react'
import { toastStates, useToasts } from './toasts_context'
import Team from './team'

const borderWidth = 1
const paddingVertical = 8
const ageGroupHeight = 24
const teamsHeight = 30
const scoreHeight = 24
const toastHeight = 2 * borderWidth + 2 * paddingVertical + ageGroupHeight + teamsHeight + scoreHeight
const toastMargin = 8

const staticStyle = {
  paddingTop: paddingVertical,
  paddingBottom: paddingVertical,
  borderWidth,
  marginTop: toastMargin,
  marginBottom: toastMargin,
}

const toPx = height => `${height}px`

const Toasts = () => {
  const { toasts } = useToasts()
  return (
    <div className="Toasts">
      {toasts.map((toast, i) => {
        const { match, state } = toast
        const { ageGroup, homeClubLogoUrl, homeTeam, homeGoals, awayClubLogoUrl, awayTeam, awayGoals, penalties, type, id } = match
        const y = state === toastStates.visible ? i * (toastHeight + 2 * toastMargin) : 0
        const opacity = state === toastStates.disappearing ? 0 : 1
        const style = { ...staticStyle, bottom: y, opacity }
        return (
          <div key={type + id} className="Toast" style={style}>
            <div className="Toast__age-group" style={{ lineHeight: toPx(ageGroupHeight) }}>{ageGroup}</div>
            <div className="Toast__teams" style={{ lineHeight: toPx(teamsHeight) }}>
              <Team club={{ logoUrl: homeClubLogoUrl }} name={homeTeam} />
              <div className="Toast__separator">–</div>
              <Team club={{ logoUrl: awayClubLogoUrl }} name={awayTeam} />
            </div>
            <div className="Toast__goals" style={{ lineHeight: toPx(scoreHeight) }}>
              <div>{homeGoals}</div>
              <div className="Toast__separator">–</div>
              <div>{awayGoals}</div>
              {penalties && <div className="Toast__penalties">rp</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Toasts
