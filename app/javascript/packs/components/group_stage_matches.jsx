import React from 'react'
import PropTypes from 'prop-types'
import GroupStageMatch from './group_stage_match'

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
      <div className={this.resolveColStyles()} key={groupStageMatch.id}>
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

  resolveColStyles = () => {
    const { fieldsCount } = this.props
    if (fieldsCount === 1) {
      return 'col-xs-12'
    } else if (fieldsCount === 2) {
      return 'col-xs-12 col-sm-6'
    } else if (fieldsCount === 3) {
      return 'col-xs-12 col-sm-6 col-md-4'
    } else if (fieldsCount % 2 === 0) {
      return 'col-xs-12 col-sm-6 col-lg-3'
    } else {
      return 'col-xs-12 col-sm-6 col-md-4'
    }
  }
}
