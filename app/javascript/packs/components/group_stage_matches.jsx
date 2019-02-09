import React from 'react'
import PropTypes from 'prop-types'
import GroupStageMatch from './group_stage_match'

export default class GroupStageMatches extends React.PureComponent {
  static propTypes = {
    accessKey: PropTypes.string,
    editable: PropTypes.bool,
    groupStageMatches: PropTypes.array.isRequired,
    onSave: PropTypes.func,
  }

  static defaultProps = {
    editable: false
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
      <div className="col-xs-12 col-sm-6 col-lg-4" key={groupStageMatch.id}>
        <GroupStageMatch
          accessKey={this.props.accessKey}
          editable={this.props.editable}
          match={groupStageMatch}
          onSave={this.props.onSave}
        />
      </div>
    )
  }
}
