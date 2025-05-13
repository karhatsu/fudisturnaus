import React from 'react'
import OfficialLinkCopy from './official_link_copy'

/* eslint-disable max-len */
const linkTexts = {
  accessKey: {
    description: 'Tällä linkillä pääsee hallinnoimaan turnauksen kaikkia asetuksia sekä syöttämään tuloksia. Jaa se vain turnauksen toimihenkilöille.',
    title: 'Kopioi linkki hallintasivuille',
  },
  resultsAccessKey: {
    description: 'Tällä linkillä pääsee syöttämään tuloksia. Voit jakaa sen esim. turnauksen tuomareille.',
    title: 'Kopioi linkki tulosten syöttöön',
  },
  publicLink: {
    description: 'Tällä linkillä pääsee katsomaan tuloksia. Voit jakaa sen kenelle tahansa, esim. turnaukseen osallistuville joukkueille.',
    title: 'Kopioi julkinen linkki',
  },
}
/* eslint-enable max-len */

const TournamentLinks = ({ tournament }) => {
  const { accessKey, resultsAccessKey, publicLink } = linkTexts
  return (
    <>
      <div className="title-2">Turnauksen linkit</div>
      <OfficialLinkCopy
        description={accessKey.description}
        path={`/official/${tournament.accessKey}`}
        title={accessKey.title}
      />
      <OfficialLinkCopy
        description={resultsAccessKey.description}
        path={`/results/${tournament.resultsAccessKey}`}
        title={resultsAccessKey.title}
      />
      <OfficialLinkCopy
        description={publicLink.description}
        path={`/t/${tournament.slug}`}
        title={publicLink.title}
      />
    </>
  )
}

export default TournamentLinks
