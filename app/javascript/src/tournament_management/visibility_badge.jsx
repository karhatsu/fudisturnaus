import { visibilityTypes } from '../util/enums'

const { onlyTitle, teams, all } = visibilityTypes

const VisibilityBadge = ({ visibility }) => {
  const resolveText = () => {
    switch (visibility) {
      case onlyTitle:
        return 'Vain perustiedot julkaistu'
      case teams:
        return 'Sarjat ja joukkueet julkaistu'
      case all:
        return 'Koko otteluohjelma julkaistu'
    }
  }

  return <div className={`badge badge--${visibility}`}>{resolveText()}</div>
}

export default VisibilityBadge
