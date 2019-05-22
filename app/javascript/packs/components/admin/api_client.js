import { handleApiConnectionError, handleApiResponse } from '../util/api_util'

export function loginToAdmin(username, password, callback) {
  fetch('/api/v1/admin/admin_sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(response => {
    if (response.ok) {
      response.json().then(data => {
        callback(null, data.sessionKey)
      })
    } else if (response.status === 401) {
      callback('Virheelliset tunnukset')
    } else {
      callback('Odottamaton virhe')
    }
  }).catch(() => handleApiConnectionError(callback))
}

export function createTournament(accessContext, data, callback) {
  fetch('/api/v1/admin/tournaments', {
    method: 'POST',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ tournament: data }),
  }).then(response => {
    handleApiResponse(response, callback)
  }).catch(() => handleApiConnectionError(callback))
}

export function fetchClubs(accessContext, callback) {
  fetch('/api/v1/admin/clubs', {
    method: 'GET',
    headers: buildHeaders(accessContext),
  }).then(response => {
    handleApiResponse(response, callback)
  }).catch(() => handleApiConnectionError(callback))
}

export function updateClub(accessContext, id, data, callback) {
  fetch(`/api/v1/admin/clubs/${id}`, {
    method: 'PUT',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ club: data }),
  }).then(response => {
    handleApiResponse(response, callback)
  }).catch(() => handleApiConnectionError(callback))
}

function buildHeaders(accessContext) {
  return {
    'Content-Type': 'application/json',
    'X-Session-Key': accessContext.adminSessionKey,
  }
}
