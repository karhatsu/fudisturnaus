export const buildUrl = path => {
  const location = window.location
  const port = location.port ? `:${location.port}` : ''
  return `${location.protocol}//${location.hostname}${port}${path}`
}
