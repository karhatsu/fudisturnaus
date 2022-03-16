import React, { useState } from 'react'
import PropTypes from 'prop-types'
import * as clipboard from 'clipboard-polyfill'
import Button from '../form/button'
import Message from '../components/message'
import { buildUrl } from '../util/url_util'

const OfficialLinkCopy = ({ description, path, title }) => {
  const [officialLinkCopied, setCopied] = useState(false)
  const [officialLinkCopyError, setError] = useState(false)

  const copyOfficialLink = () => {
    const url = buildUrl(path)
    clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 5000)
    }).catch(() => {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 5000)
    })
  }

  const successFeedbackStyle = officialLinkCopied ? undefined :  { display: 'none' }
  const errorFeedbackStyle = officialLinkCopyError ? undefined :  { display: 'none' }
  return (
    <div className="tournament-management__section">
      <div className="official-link">
        <Button onClick={copyOfficialLink} label={title} type="primary" />
        <div className="official-link__description">{description}</div>
        <Message type="success" style={successFeedbackStyle}>Linkki kopioitu leikepöydälle</Message>
        <Message type="error" style={errorFeedbackStyle}>Selaimesi ei tue linkin kopiointia</Message>
      </div>
    </div>
  )
}

OfficialLinkCopy.propTypes = {
  description: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default OfficialLinkCopy
