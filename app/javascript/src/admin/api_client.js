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

export function createTournament(accessContext, tournament, contactId, callback) {
  fetch('/api/v1/admin/tournaments', {
    method: 'POST',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ tournament, contactId }),
  }).then(response => {
    handleApiResponse(response, callback)
  }).catch(() => handleApiConnectionError(callback))
}

export function deleteTournament(accessContext, id, callback) {
  fetch(`/api/v1/admin/tournaments/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  }).then(response => {
    handleApiResponse(response, callback)
  }).catch(() => handleApiConnectionError(callback))
}

export function deleteClub(accessContext, id, callback) {
  fetch(`/api/v1/admin/clubs/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
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

export function createClub(accessContext, data, callback) {
  fetch('/api/v1/admin/clubs', {
    method: 'POST',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ club: data }),
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

export function fetchContacts(accessContext, callback) {
  fetch('/api/v1/admin/contacts', {
    method: 'GET',
    headers: buildHeaders(accessContext),
  }).then(response => {
    handleApiResponse(response, callback)
  }).catch(() => handleApiConnectionError(callback))
}

export function fetchContact(accessContext, id, callback) {
  fetch(`/api/v1/admin/contacts/${id}`, {
    method: 'GET',
    headers: buildHeaders(accessContext),
  }).then(response => {
    handleApiResponse(response, callback)
  }).catch(() => handleApiConnectionError(callback))
}

export function fetchUnhandledContactCount(accessContext, callback) {
  fetch('/api/v1/admin/unhandled_contacts', {
    method: 'GET',
    headers: buildHeaders(accessContext),
  }).then(response => {
    handleApiResponse(response, callback)
  }).catch(() => handleApiConnectionError(callback))
}

export function refreshCache(accessContext, callback) {
  fetch('/api/v1/admin/cache', {
    method: 'PUT',
    headers: buildHeaders(accessContext),
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
