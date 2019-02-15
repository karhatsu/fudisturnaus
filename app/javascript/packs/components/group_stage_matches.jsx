import React from 'react'
import PropTypes from 'prop-types'
import GroupStageMatch from './group_stage_match'
import {resolveColStyles} from './util/util'

export default class GroupStageMatches extends React.PureComponent {
  static propTypes = {
    accessKey: PropTypes.string,
    editable: PropTypes.bool,
    fieldsCount: PropTypes.number.isRequired,
    groupStageMatches: PropTypes.array.isRequired,
    onSave: PropTypes.func,
    selectedClubId: PropTypes.number,
    selectedTeamId: PropTypes.number,
  }

  static defaultProps = {
    editable: false,
  }

  render() {
    const matchesByDate = this.groupByDate()
    return (
      <div className="group-stage-matches">
        {Object.keys(matchesByDate).map(date => this.renderDate(matchesByDate, date))}
      </div>
    )
  }

  groupByDate = () => {
    return this.props.groupStageMatches.reduce((matches, match) => {
      matches[match.startTime] = matches[match.startTime] || []
      matches[match.startTime].push(match)
      return matches
    }, {})
  }

  renderDate = (matchesByDate, date) => {
    return (
      <div className="row match-time-row" key={date}>
        {matchesByDate[date].map(this.renderGroupStageMatch)}
      </div>
    )
  }

  renderGroupStageMatch = groupStageMatch => {
    return (
      <div className={resolveColStyles(this.props.fieldsCount)} key={groupStageMatch.id}>
        <GroupStageMatch
          accessKey={this.props.accessKey}
          editable={this.props.editable}
          match={groupStageMatch}
          onSave={this.props.onSave}
          selectedClubId={this.props.selectedClubId}
          selectedTeamId={this.props.selectedTeamId}
        />
      </div>
    )
  }
}
