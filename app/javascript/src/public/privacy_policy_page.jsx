import React from 'react'
import Title from '../components/title'

const PrivacyPolicyPage = () => (
  <div>
    <Title text="Tietosuojalauseke" loading={false}/>

    <div className="title-2">Mitä tietoja kerätään?</div>
    <div className="info-box">
      fudisturnaus.com kerää turnauksista talteen vain ne tiedot, joita turnauksen järjestäjä tallentaa. Näitä ovat mm.
      sarjat, joukkueet, ottelut sekä niiden tulokset. Turnauksen julkisten sivujen käytöstä ei kerätä mitään tietoja.
    </div>

    <div className="title-2">Käyttäjiin liittyvät tiedot</div>
    <div className="info-box">
      Turnausten hallintasivut perustuvat anonyymeihin linkkeihin, joten fudisturnaus.com ei tallenna käyttäjistä mitään
      tietoja.
    </div>

    <div className="title-2">Kolmansille osapuolille lähetettävät tiedot</div>
    <div className="info-box">
      Mitään turnaustietoja ei suoraan lähetetä kolmansille osapuolille. Lisäksi fudisturnaus.com näyttää Googlen
      tarjoamia mainoksia, joihin liittyen Google kerää tietoja.
    </div>
  </div>
)

export default PrivacyPolicyPage
