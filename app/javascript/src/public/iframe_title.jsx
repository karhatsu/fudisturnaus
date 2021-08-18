import React from 'react'

const isIframe = () => {
  try {
    return window.top !== window.self
  } catch (err) {
    return true
  }
}

export default function IframeTitle() {
  if (!isIframe()) return null
  return (
    <div className="IframeTitle">
      <a href="https://www.fudisturnaus.com" target="_blank" rel="noreferrer">
        fudisturnaus.com
      </a>
    </div>
  )
}
