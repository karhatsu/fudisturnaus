const unexpectedErrorMsg = 'Odottamaton virhe, yritä uudestaan. Jos ongelma ei poistu, ota yhteys palvelun ylläpitoon.'

export function handleApiResponse(response, callback) {
  if (response.status === 201 || response.status === 204) {
    callback()
  } else if (response.ok) {
    response.json().then(data => {
      callback(null, data)
    }).catch(() => callback([unexpectedErrorMsg]))
  } else {
    response.json().then(({ errors }) => {
      callback(errors)
    }).catch(() => callback([unexpectedErrorMsg]))
  }
}

export function handleApiConnectionError(callback) {
  callback(['Yhteysvirhe, yritä uudestaan'])
}
