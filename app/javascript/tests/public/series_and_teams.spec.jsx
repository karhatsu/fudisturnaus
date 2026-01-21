import { render, screen } from '@testing-library/react'
import SeriesAndTeams from '../../src/public/series_and_teams'

describe('SeriesAndTeams', () => {
  let tournament
  let component

  describe('when no age groups', () => {
    beforeEach(() => {
      tournament = { ageGroups: [], cancelled: false, clubs: [], groups: [], teams: [] }
    })

    describe('and the tournament is not cancelled', () => {
      beforeEach(() => {
        component = render(<SeriesAndTeams tournament={tournament} />)
      })

      it('renders message about matches', () => {
        expect(screen.getByText('Turnauksen otteluohjelma julkaistaan myöhemmin')).toBeInTheDocument()
      })

      it('does not render age groups', () => {
        expect(component.container.querySelectorAll('.series-and-teams__age-group')).toHaveLength(0)
      })
    })

    describe('and the tournament is cancelled', () => {
      beforeEach(() => {
        tournament.cancelled = true
        component = render(<SeriesAndTeams tournament={tournament} />)
      })

      it('does not render message about matches', () => {
        expect(component.container.querySelectorAll('.message.message--warning')).toHaveLength(0)
      })
    })
  })

  describe('when one age group without teams', () => {
    beforeEach(() => {
      tournament = { ageGroups: [{ id: 1, name: 'T07' }], cancelled: false, clubs: [], groups: [], teams: [] }
      component = render(<SeriesAndTeams tournament={tournament} />)
    })

    it('renders age group with generic title', () => {
      expect(component.container.querySelector('.series-and-teams__age-group .title-2').textContent).toBe(
        'Ilmoittautuneet joukkueet',
      )
    })

    it('renders tournament level message about no teams', () => {
      expect(component.container.querySelector('.series-and-teams__no-teams').textContent).toBe(
        'Turnaukseen ei ole ilmoittautunut vielä yhtään joukkuetta',
      )
    })
  })

  describe('when one age group with teams in one group', () => {
    beforeEach(() => {
      tournament = {
        ageGroups: [{ id: 1, name: 'T07' }],
        cancelled: false,
        clubs: [],
        groups: [{ ageGroupId: 1, id: 20, name: 'A' }],
        teams: [
          { ageGroupId: 1, clubId: 100, groupId: 20, id: 10, name: 'FC Team 1' },
          { ageGroupId: 1, clubId: 100, groupId: 20, id: 11, name: 'SC Team 1' },
        ],
      }
      component = render(<SeriesAndTeams tournament={tournament} />)
    })

    it('renders age group with generic title', () => {
      expect(component.container.querySelector('.series-and-teams__age-group .title-2').textContent).toBe(
        'Ilmoittautuneet joukkueet',
      )
    })

    it('renders teams for the age group without group name', () => {
      const teams = component.container.querySelectorAll('.series-and-teams__team')
      expect(teams.length).toBe(2)
      expect(teams[0]).toHaveTextContent('FC Team 1')
      expect(teams[1]).toHaveTextContent('SC Team 1')
      expect(component.container.querySelectorAll('.series-and-teams__group-title').length).toBe(0)
    })
  })

  describe('when two age group with the other having teams in multiple groups', () => {
    beforeEach(() => {
      tournament = {
        ageGroups: [
          { id: 1, name: 'T07' },
          { id: 2, name: 'T08' },
        ],
        cancelled: false,
        clubs: [],
        groups: [
          { ageGroupId: 1, id: 10, name: 'A' },
          { ageGroupId: 1, id: 11, name: 'B' },
          { ageGroupId: 1, id: 12, name: 'C' },
        ],
        teams: [
          { ageGroupId: 1, clubId: 100, groupId: 10, id: 10, name: 'FC Team 1' },
          { ageGroupId: 1, clubId: 100, groupId: 11, id: 11, name: 'SC Team 1' },
          { ageGroupId: 5, clubId: 100, groupId: 10, id: 12, name: 'SC Team 2' },
        ],
      }
      component = render(<SeriesAndTeams tournament={tournament} />)
    })

    it('renders age group names as titles', () => {
      const ageGroups = component.container.querySelectorAll('.series-and-teams__age-group')
      expect(ageGroups.length).toBe(2)
      expect(ageGroups[0].querySelector('.title-2').textContent).toEqual('T07')
      expect(ageGroups[1].querySelector('.title-2').textContent).toEqual('T08')
    })

    it('renders age group with those groups that have teams', () => {
      const ageGroupsWithTeams = component.container.querySelectorAll('.series-and-teams__age-group')[0]
      const groups = ageGroupsWithTeams.querySelectorAll('.series-and-teams__group')
      expect(groups.length).toEqual(2)
      expect(groups[0].querySelectorAll('.series-and-teams__group-title')[0].textContent).toEqual('A')
      expect(groups[1].querySelectorAll('.series-and-teams__group-title')[0].textContent).toEqual('B')
    })

    it('renders team names inside the groups', () => {
      const ageGroupsWithTeams = component.container.querySelectorAll('.series-and-teams__age-group')[0]
      const groups = ageGroupsWithTeams.querySelectorAll('.series-and-teams__group')
      const group1Teams = groups[0].querySelectorAll('.series-and-teams__team')
      expect(group1Teams.length).toEqual(2)
      expect(group1Teams[0].textContent).toEqual('FC Team 1')
      expect(group1Teams[1].textContent).toEqual('SC Team 2')
      const group2Teams = groups[1].querySelectorAll('.series-and-teams__team')
      expect(group2Teams.length).toEqual(1)
      expect(group2Teams[0].textContent).toEqual('SC Team 1')
    })

    it('renders age group level message about no teams', () => {
      const ageGroupWithoutTeams = component.container.querySelectorAll('.series-and-teams__age-group')[1]
      const noTeamsMsg = 'Sarjaan ei ole ilmoittautunut vielä yhtään joukkuetta'
      expect(ageGroupWithoutTeams.querySelectorAll('.series-and-teams__no-teams')[0].textContent).toEqual(noTeamsMsg)
    })
  })
})
