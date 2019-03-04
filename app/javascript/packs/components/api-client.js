import { matchTypes } from './util/enums'

const unexpectedErrorMsg = 'Odottamaton virhe, yritä uudestaan. Jos ongelma ei poistu, ota yhteys palvelun ylläpitoon.'

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

export function saveResult(accessKey, type, matchId, homeGoals, awayGoals, penalties, callback) {
  const typePath = type === matchTypes.playoff ? 'playoff_results' : 'group_stage_results'
  fetch(`/api/v1/official/${typePath}/${matchId}`, {
    method: 'PUT',
    headers: officialHeaders(accessKey),
    body: JSON.stringify({
      match: {
        home_goals: homeGoals,
        away_goals: awayGoals,
        penalties,
      },
    }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

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

export function saveTournament(adminSessionKey, id, data, callback) {
  fetch(`/api/v1/admin/tournaments/${id}`, {
    method: 'PATCH',
    headers: adminHeaders(adminSessionKey),
    body: JSON.stringify({ tournament: data }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function saveField(adminSessionKey, tournamentId, id, name, callback) {
  const url = `/api/v1/admin/tournaments/${tournamentId}/fields` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: adminHeaders(adminSessionKey),
    body: JSON.stringify({ field: { name } }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function deleteField(adminSessionKey, tournamentId, id, callback) {
  fetch(`/api/v1/admin/tournaments/${tournamentId}/fields/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(adminSessionKey),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function saveAgeGroup(adminSessionKey, tournamentId, id, name, callback) {
  const url = `/api/v1/admin/tournaments/${tournamentId}/age_groups` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: adminHeaders(adminSessionKey),
    body: JSON.stringify({ age_group: { name } }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function deleteAgeGroup(adminSessionKey, tournamentId, id, callback) {
  fetch(`/api/v1/admin/tournaments/${tournamentId}/age_groups/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(adminSessionKey),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

function handleSaveResponse(response, callback) {
  if (response.ok) {
    response.json().then(data => {
      callback(null, data)
    }).catch(() => callback([unexpectedErrorMsg]))
  } else {
    response.json().then(({ errors }) => {
      callback(errors)
    }).catch(() => callback([unexpectedErrorMsg]))
  }
}

function handleConnectionErrorOnSave(callback) {
  callback(['Yhteysvirhe, yritä uudestaan'])
}

function officialHeaders(accessKey) {
  return {
    'Content-Type': 'application/json',
    'X-Access-Key': accessKey,
  }
}

function adminHeaders(adminSessionKey) {
  return {
    'Content-Type': 'application/json',
    'X-Session-Key': adminSessionKey,
  }
}
