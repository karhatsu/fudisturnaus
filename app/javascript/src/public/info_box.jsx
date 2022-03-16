import React from 'react'
import { Link } from 'react-router-dom'

const InfoBox = () => {
  return (
    <div>
      <div className="title-2">Mikä fudisturnaus.com?</div>
      <div className="info-box">
        <Link to="/info" className="info-box__link">
          Tarvitsetko tulospalvelun omalle junnuturnauksellesi? Lue lisää täältä.
        </Link>
      </div>
    </div>
  )
}

export default InfoBox
