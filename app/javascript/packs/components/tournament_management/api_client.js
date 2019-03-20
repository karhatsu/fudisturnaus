import { matchTypes } from '../util/enums'
import { handleConnectionErrorOnSave, handleSaveResponse } from '../util/api_util'

export function saveResult(accessContext, tournamentId, type, matchId, homeGoals, awayGoals, penalties, callback) {
  const typePath = type === matchTypes.playoff ? 'playoff_results' : 'group_stage_results'
  fetch(`/api/v1/official/tournaments/${tournamentId}/${typePath}/${matchId}`, {
    method: 'PUT',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({
      match: { homeGoals, awayGoals, penalties },
    }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function fetchTournament(accessContext, id, callback) {
  fetch(`/api/v1/official/tournaments/${id}`, {
    method: 'GET',
    headers: buildHeaders(accessContext),
  })
    .then(response => response.json())
    .then(tournament => callback(null, tournament))
    .catch(() => handleConnectionErrorOnSave(callback))
}

export function updateTournament(accessContext, id, data, callback) {
  fetch(`/api/v1/official/tournaments/${id}`, {
    method: 'PATCH',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ tournament: data }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function saveField(accessContext, tournamentId, id, name, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/fields` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ field: { name } }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function deleteField(accessContext, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/fields/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function saveAgeGroup(accessContext, tournamentId, id, data, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/age_groups` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ ageGroup: data }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function deleteAgeGroup(accessContext, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/age_groups/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function saveGroup(accessContext, tournamentId, id, data, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/groups` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ group: data }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function deleteGroup(accessContext, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/groups/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function createClub(accessContext, name, callback) {
  const url = '/api/v1/official/clubs'
  fetch(url, {
    method: 'POST',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ name }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function saveTeam(accessContext, tournamentId, id, data, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/teams` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ team: data }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function deleteTeam(accessContext, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/teams/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function saveGroupStageMatch(accessContext, tournamentId, id, data, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/group_stage_matches` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ groupStageMatch: data }),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

export function deleteGroupStageMatch(accessContext, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/group_stage_matches/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  }).then(response => {
    handleSaveResponse(response, callback)
  }).catch(() => handleConnectionErrorOnSave(callback))
}

function buildHeaders(accessContext) {
  const headers = { 'Content-Type': 'application/json' }
  if (accessContext.officialAccessKey) {
    headers['X-Access-Key'] = accessContext.officialAccessKey
  } else if (accessContext.adminSessionKey) {
    headers['X-Session-Key'] = accessContext.adminSessionKey
  }
  return headers
}
