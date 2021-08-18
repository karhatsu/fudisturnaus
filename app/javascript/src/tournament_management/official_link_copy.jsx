import React from 'react'
import PropTypes from 'prop-types'
import * as clipboard from 'clipboard-polyfill'
import Button from '../form/button'
import Message from '../components/message'

export default class OfficialLinkCopy extends React.PureComponent {
  static propTypes = {
    description: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
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
          <Message type="success" style={successFeedbackStyle}>Linkki kopioitu leikepöydälle</Message>
          <Message type="error" style={errorFeedbackStyle}>Selaimesi ei tue linkin kopiointia</Message>
        </div>
      </div>
    )
  }

  copyOfficialLink = () => {
    const location = window.location
    const port = location.port ? `:${location.port}` : ''
    const url = `${location.protocol}//${location.hostname}${port}${this.props.path}`
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
