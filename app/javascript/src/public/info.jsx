import React, { useEffect, useState } from 'react'
import Title from '../components/title'
import ContactForm from './contact_form'
import { fetchOrganizers } from './api_client'

const Info = () => {
  const [organizers, setOrganizers] = useState()
  useEffect(() => {
    fetchOrganizers((err, result) => {
      setOrganizers(result)
    })
  }, [])

  return (
    <div>
      <Title iconLink="/" loading={false} text="fudisturnaus.com - Info"/>
      <div className="title-2">Mikä on fudisturnaus.com?</div>
      <div className="info-box">
        <div className="info-box__paragraph">fudisturnaus.com on helppokäyttöinen ja ilmainen tulospalvelu jalkapallon
          junioriturnauksia varten. Sen avulla jaat kätevästi turnauksen otteluohjelman muille joukkueille ja hoidat
          turnauksen tulospalvelun.</div>
        <div className="info-box__paragraph">Tämän tulospalvelun teossa on panostettu erityisesti käytettävyyteen niin
          toimitsijoiden kuin turnauksen osallistujienkin näkökulmasta.</div>
      </div>
      <div className="title-2">Paljonko palvelun käyttö maksaa?</div>
      <div className="info-box">Palvelu on ilmainen.</div>
      <div className="title-2">Mitkä ovat palvelun tärkeimmät ominaisuudet?</div>
      <div className="info-box">
        <ul>
          <li>Otteluohjelman tekeminen on erittäin helppoa. Järjestäjän tarvitsee vain syöttää turnauksen ja sarjojen
            perustiedot, joukkueet sekä ottelut.</li>
          <li>Koko turnauksen otteluohjelma sarjataulukkoineen löytyy yhdeltä julkiselta sivulta. Tällä sivulla
            on helppo etsiä esim. oman sarjan, seuran tai joukkueen ottelut.</li>
          <li>Otteluiden tulosten tallentaminen onnistuu todella helposti vaikkapa kännykällä.</li>
          <li>Tulosten tallentamiseen on monta eri vaihtoehtoa. Järjestäjä voi tallentaa tulokset itse tai tuomareille
            voi jakaa linkin, jonka kauttaa he pääsevät tallentamaan tulokset suoraan. Otteluille voi myös asetella
            tuomarit, jolloin jokainen heistä saa tulosten tallentamista varten oman linkkinsä. Tämä vaihtoehto on
            erittäin kätevä erityisesti isommissa turnauksissa, joissa pelejä on paljon.</li>
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
      {organizers && (
        <>
          <div className="title-2">Liity näiden turnausjärjestäjien joukkoon!</div>
          <div className="info-box info-box--organizers">
            {organizers.map(club => (
              <div key={club.name} className="info-box__organizer">
                <img src={club.logoUrl} alt={club.name} />
                <div className="info-box__organizer-name">{club.name}</div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="title-2">Miten saamme palvelun käyttöön?</div>
      <div className="email-error-issue">
        Huom! Sähköpostin lähetyksessä on ollut ongelmia 8.3.2024 - 3.4.2024 välillä. Jos olet yrittänyt lähettää
        turnauksen tietoja kyseisenä aikana ekä ole saanut vastausta, lähetäthän tiedot uudestaan. Pahoittelemme
        ongelmaa!
      </div>
      <div className="info-box">
        <ContactForm/>
      </div>
    </div>
  )
}

export default Info
