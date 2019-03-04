export function fetchTournaments(callback) {
  fetch('/api/v1/tournaments')
    .then(response => response.json())
    .then(json => callback(null, json.tournaments))
    .catch(err => {
      console.error(err) // eslint-disable-line no-console
      callback(true)
    })
}

export function fetchTournament(id, callback) {
  fetch(`/api/v1/tournaments/${id}`)
    .then(response => response.json())
    .then(tournament => callback(null, tournament))
    .catch(err => {
      console.error(err) // eslint-disable-line no-console
      callback(true)

    })
}
