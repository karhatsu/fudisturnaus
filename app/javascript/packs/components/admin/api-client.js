const unexpectedErrorMsg = 'Odottamaton virhe, yritä uudestaan. Jos ongelma ei poistu, ota yhteys palvelun ylläpitoon.'

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

export function fetchTournament(adminAccessKey, id, callback) {
  fetch(`/api/v1/admin/tournaments/${id}`, {
    method: 'GET',
    headers: adminHeaders(adminAccessKey),
  })
    .then(response => response.json())
    .then(tournament => callback(null, tournament))
    .catch(() => handleConnectionErrorOnSave(callback))
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

export function saveAgeGroup(adminSessionKey, tournamentId, id, data, callback) {
  const url = `/api/v1/admin/tournaments/${tournamentId}/age_groups` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: adminHeaders(adminSessionKey),
    body: JSON.stringify({ ageGroup: data }),
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

export function saveGroup(adminSessionKey, tournamentId, id, data, callback) {
  const url = `/api/v1/admin/tournaments/${tournamentId}/groups` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: adminHeaders(adminSessionKey),
    body: JSON.stringify({ group: data }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function deleteGroup(adminSessionKey, tournamentId, id, callback) {
  fetch(`/api/v1/admin/tournaments/${tournamentId}/groups/${id}`, {
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

function adminHeaders(adminSessionKey) {
  return {
    'Content-Type': 'application/json',
    'X-Session-Key': adminSessionKey,
  }
}
