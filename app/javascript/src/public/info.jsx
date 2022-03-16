import React from 'react'
import Title from '../components/title'
import ContactForm from './contact_form'

const Info = () => {
  return (
    <div>
      <Title iconLink="/" loading={false} text="fudisturnaus.com - Info"/>
      <div className="title-2">Mikä on fudisturnaus.com?</div>
      <div className="info-box">
        fudisturnaus.com on helppokäyttöinen tulospalvelu jalkapallon junioriturnauksia varten.
        Sen avulla jaat kätevästi turnauksen otteluohjelman muille joukkueille ja hoidat turnauksen tulospalvelun.
      </div>
      <div className="title-2">Mitkä ovat palvelun tärkeimmät ominaisuudet?</div>
      <div className="info-box">
        <ul>
          <li>Otteluohjelman tekeminen on erittäin helppoa. Järjestäjän tarvitsee vain syöttää turnauksen ja sarjojen
            perustiedot, joukkueet sekä ottelut.</li>
          <li>Koko turnauksen otteluohjelma sarjataulukkoineen löytyy yhdeltä julkiselta sivulta. Tällä sivulla
            on helppo etsiä esim. oman sarjan, seuran tai joukkueen ottelut.</li>
          <li>Otteluiden tulosten tallentaminen onnistuu todella helposti vaikkapa kännykällä. Voit jopa halutessasi
            jakaa tuomareille linkin, jonka kautta he syöttävät tuloksen suoraan ottelun päätyttyä. Vaihtoehtoisesti
            järjestäjät voivat tietysti itse syöttää tulokset.</li>
          <li>Tulokset näkyvät muille käyttäjille automaattisesti ilman, että sivua tarvitsee edes päivittää.
            Jokaisen ottelun jälkeen tieto päivittyy myös sarjataulukoihin.</li>
          <li>Kun alkulohkon kaikki ottelut on pelattu, ohjelma asettaa joukkueet jatko-otteluihin ilman erillisiä
            toimenpiteitä.</li>
          <li>Tasapisteitä varten voit määrittää säännöksi joko keskinäiset ottelut ensin tai kaikkien otteluiden
            maaliero ja tehdyt maalit ensin. Mikäli näidenkään avulla ei eroa synny, joukkueille voi tallentaa
            arvonnan tuloksen.</li>
          <li>Sivusto toimii hyvin niin puhelimilla, tableteilla kuin pöytäkoneillakin.</li>
        </ul>
      </div>
      <div className="title-2">Paljonko palvelun käyttö maksaa?</div>
      <div className="info-box">Palvelu on ilmainen.</div>
      <div className="title-2">Miten saamme palvelun käyttöön?</div>
      <div className="info-box">
        <ContactForm/>
      </div>
    </div>
  )
}

export default Info
