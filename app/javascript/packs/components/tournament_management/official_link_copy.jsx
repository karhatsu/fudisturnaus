import React from 'react'
import PropTypes from 'prop-types'
import * as clipboard from 'clipboard-polyfill'
import Button from '../form/button'

export default class OfficialLinkCopy extends React.PureComponent {
  static propTypes = {
    accessKey: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    namespace: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      officialLinkCopied: false,
      officialLinkCopyError: false,
    }
  }

  render() {
    const successFeedbackStyle = this.state.officialLinkCopied ? undefined :  { display: 'none' }
    const errorFeedbackStyle = this.state.officialLinkCopyError ? undefined :  { display: 'none' }
    return (
      <div className="tournament-management__section">
        <div className="official-link">
          <Button onClick={this.copyOfficialLink} label={this.props.title} type="primary" />
          <div className="official-link__description">{this.props.description}</div>
          <div className="message message--success" style={successFeedbackStyle}>Linkki kopioitu leikepöydälle</div>
          <div className="message message--error" style={errorFeedbackStyle}>Selaimesi ei tue linkin kopiointia</div>
        </div>
      </div>
    )
  }

  copyOfficialLink = () => {
    const location = window.location
    const port = location.port ? `:${location.port}` : ''
    const url = `${location.protocol}//${location.hostname}${port}/${this.props.namespace}/${this.props.accessKey}`
    clipboard.writeText(url).then(() => {
      this.setState({ officialLinkCopied: true })
      setTimeout(() => {
        this.setState({ officialLinkCopied: false })
      }, 5000)
    }).catch(() => {
      this.setState({ officialLinkCopyError: true })
      setTimeout(() => {
        this.setState({ officialLinkCopyError: false })
      }, 5000)
    })
  }
}
