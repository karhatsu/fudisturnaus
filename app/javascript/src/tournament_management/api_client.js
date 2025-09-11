import { matchTypes } from '../util/enums'
import { handleApiConnectionError, handleApiResponse } from '../util/api_util'

export function saveResult(accessContext, tournamentId, type, matchId, homeGoals, awayGoals, penalties, callback) {
  const typePath = type === matchTypes.playoff ? 'playoff_results' : 'group_stage_results'
  fetch(`/api/v1/official/tournaments/${tournamentId}/${typePath}/${matchId}`, {
    method: 'PUT',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({
      match: { homeGoals, awayGoals, penalties },
    }),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function fetchTournament(accessContext, id, callback) {
  fetch(`/api/v1/official/tournaments/${id}`, {
    method: 'GET',
    headers: buildHeaders(accessContext),
  })
    .then((response) => response.json())
    .then((tournament) => callback(null, tournament))
    .catch(() => handleApiConnectionError(callback))
}

export function updateTournament(accessContext, id, data, callback) {
  fetch(`/api/v1/official/tournaments/${id}`, {
    method: 'PATCH',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ tournament: data }),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function saveField(accessContext, tournamentId, id, name, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/fields` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ field: { name } }),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function deleteField(accessContext, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/fields/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function saveAgeGroup(accessContext, tournamentId, id, data, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/age_groups` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ ageGroup: data }),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function deleteAgeGroup(accessContext, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/age_groups/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function saveGroup(accessContext, pathType, tournamentId, id, data, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/${pathType}` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ group: data }),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function deleteGroup(accessContext, pathType, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/${pathType}/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function createClub(accessContext, name, callback) {
  const url = '/api/v1/official/clubs'
  fetch(url, {
    method: 'POST',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ name }),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function saveTeam(accessContext, tournamentId, id, data, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/teams` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ team: data }),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function deleteTeam(accessContext, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/teams/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function saveGroupStageMatch(accessContext, tournamentId, id, data, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/group_stage_matches` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ groupStageMatch: data }),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function deleteGroupStageMatch(accessContext, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/group_stage_matches/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function savePlayoffMatch(accessContext, tournamentId, id, data, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/playoff_matches` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ playoffMatch: data }),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function deletePlayoffMatch(accessContext, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/playoff_matches/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function saveReferee(accessContext, tournamentId, id, name, callback) {
  const url = `/api/v1/official/tournaments/${tournamentId}/referees` + (id ? `/${id}` : '')
  const method = id ? 'PATCH' : 'POST'
  fetch(url, {
    method,
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ referee: { name } }),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function deleteReferee(accessContext, tournamentId, id, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/referees/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessContext),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function saveLottery(accessContext, tournamentId, groupId, data, callback) {
  fetch(`/api/v1/official/tournaments/${tournamentId}/groups/${groupId}/lottery`, {
    method: 'PUT',
    headers: buildHeaders(accessContext),
    body: JSON.stringify({ teams: data }),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

export function fetchAddressSuggestions(accessContext, location, callback) {
  fetch(`/api/v1/official/address_suggestions?location=${encodeURIComponent(location)}`, {
    headers: buildHeaders(accessContext),
  })
    .then((response) => {
      handleApiResponse(response, callback)
    })
    .catch(() => handleApiConnectionError(callback))
}

function buildHeaders(accessContext) {
  const headers = { 'Content-Type': 'application/json' }
  if (accessContext.officialAccessKey) {
    headers['X-Access-Key'] = accessContext.officialAccessKey
  } else if (accessContext.resultsAccessKey) {
    headers['X-Results-Access-Key'] = accessContext.resultsAccessKey
  } else if (accessContext.refereeAccessKey) {
    headers['X-Referee-Access-Key'] = accessContext.refereeAccessKey
  } else if (accessContext.adminSessionKey) {
    headers['X-Session-Key'] = accessContext.adminSessionKey
  }
  return headers
}
