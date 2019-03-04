import { matchTypes } from '../util/enums'

const unexpectedErrorMsg = 'Odottamaton virhe, yritä uudestaan. Jos ongelma ei poistu, ota yhteys palvelun ylläpitoon.'

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
