import React from 'react'
import { Link } from 'react-router'

const Hero = () => {
  return (
    <div className="Hero">
      <Link to="/info">
        <img src="/logo.jpg" alt="Pallo" />
      </Link>
      <div className="Hero__texts">
        <div className="Hero__title">Tarvitsetko tulospalvelun omalle fudisturnaukselle?</div>
        <Link className="Hero__button" to="/info">Lue lisää</Link>
      </div>
    </div>
  )
}

export default Hero
