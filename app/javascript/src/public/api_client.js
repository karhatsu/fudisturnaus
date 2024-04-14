import { handleApiConnectionError, handleApiResponse } from '../util/api_util'

export function fetchTournaments(query, callback) {
  fetch(`/api/v1/public/tournaments?${new URLSearchParams(query).toString()}`)
    .then(response => response.json())
    .then(json => callback(null, json.tournaments))
    .catch(err => {
      console.error(err) // eslint-disable-line no-console
      callback(true)
    })
}

export function fetchTournament(key, callback) {
  fetch(`/api/v1/public/tournaments/${key}`)
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
    body: JSON.stringify({ contact: data }),
    headers: { 'Content-Type': 'application/json' },
  }).then(response => {
    handleApiResponse(response, callback)
  }).catch(() => handleApiConnectionError(callback))
}

export function fetchOrganizers(callback) {
  fetch('/api/v1/public/organizers')
    .then(response => response.json())
    .then(json => callback(null, json.organizers))
    .catch(err => {
      console.error(err) // eslint-disable-line no-console
      callback(undefined)
    })
}
