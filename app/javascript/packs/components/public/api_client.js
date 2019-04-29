import { handleConnectionErrorOnSave, handleSaveResponse } from '../util/api_util'

export function fetchTournaments(callback) {
  fetch('/api/v1/public/tournaments')
    .then(response => response.json())
    .then(json => callback(null, json.tournaments))
    .catch(err => {
      console.error(err) // eslint-disable-line no-console
      callback(true)
    })
}

export function fetchTournament(id, callback) {
  fetch(`/api/v1/public/tournaments/${id}`)
    .then(response => response.json())
    .then(tournament => callback(null, tournament))
    .catch(err => {
      console.error(err) // eslint-disable-line no-console
      callback(true)

    })
}

export function sendContactRequest(data, callback) {
  fetch('/api/v1/public/contacts', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}
