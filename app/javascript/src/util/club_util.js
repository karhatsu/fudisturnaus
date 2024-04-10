const normalize = (str) => str.toLowerCase().replace(/[-\s]/g, '')

export const filterClubs = (clubs, search) => {
  const s = normalize(search)
  return clubs.filter(({ name, alias }) => normalize(name).match(s) || (alias && normalize(alias).match(s)))
}
