import { handleConnectionErrorOnSave, handleSaveResponse } from '../util/api_util'

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
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function createTournament(accessContext, data, callback) {
  fetch('/api/v1/admin/tournaments', {
    method: 'POST',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ tournament: data }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

function buildHeaders(accessContext) {
  return {
    'Content-Type': 'application/json',
    'X-Session-Key': accessContext.adminSessionKey,
  }
}