import React from 'react'
import PropTypes from 'prop-types'
import * as clipboard from 'clipboard-polyfill'

export default class OfficialLinkCopy extends React.PureComponent {
  static propTypes = {
    accessKey: PropTypes.string.isRequired,
    namespace: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
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
      <div className="tournament-management__section official-link">
        <div className="official-link__copy" onClick={this.copyOfficialLink}>{this.props.text}</div>
        <div className="official-link__feedback" style={successFeedbackStyle}>Linkki kopioitu leikepöydälle</div>
        <div className="official-link__error" style={errorFeedbackStyle}>Selaimesi ei tue linkin kopiointia</div>
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
