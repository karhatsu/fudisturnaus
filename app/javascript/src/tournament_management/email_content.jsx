import React, { useState } from 'react'
import * as clipboard from 'clipboard-polyfill'
import Button from '../form/button'
import Message from '../components/message'
import { buildUrl } from '../util/url_util'

const EmailContent = ({ tournament }) => {
  const [emailCopied, setEmailCopied] = useState(false)

  const copyEmailContent = () => {
    const email = `Moikka!

Tällä linkillä pääset syöttämään turnauksen sarjat ja ottelut:
${buildUrl(`/official/${tournament.accessKey}`)}

Tätä linkkiä voit jakaa osallistuville joukkueille:
${buildUrl(`/t/${tournament.slug}`)}

Laita viestiä jos tarvitset lisäohjeita, niin autan mielelläni.

Henri`
    clipboard.writeText(email).then(() => {
      setEmailCopied(true)
      setTimeout(() => {
        setEmailCopied(false)
      }, 5000)
    }).catch(console.error)
  }

  return (
    <>
      <div className="title-2">Sähköposti</div>
      <div className="tournament-management__section">
        <Button onClick={copyEmailContent} label="Kopioi teksti" type="primary" />
        {emailCopied && <Message type="success">Sähköposti kopioitu leikepöydälle</Message>}
      </div>
    </>
  )
}

export default EmailContent
