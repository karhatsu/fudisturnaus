import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@cfaester/enzyme-adapter-react-18'
import SeriesAndTeams from '../../src/public/series_and_teams'

Enzyme.configure({ adapter: new Adapter() })

describe('SeriesAndTeams', () => {
  let tournament
  let component

  describe('when no age groups', () => {
    beforeEach(() => {
      tournament = { ageGroups: [], cancelled: false, clubs: [], groups: [], teams: [] }
    })

    describe('and the tournament is not cancelled', () => {
      beforeEach(() => {
        component = shallow(<SeriesAndTeams tournament={tournament}/>)
      })

      it('renders message about matches', () => {
        const message = component.find('Message')
        expect(message.prop('type')).toEqual('warning')
        expect(message.prop('fullPage')).toEqual(true)
        expect(message.prop('children')).toEqual('Turnauksen otteluohjelma julkaistaan myöhemmin')
      })

      it('does not render age groups', () => {
        expect(component.find('.series-and-teams__age-group')).toHaveLength(0)
      })
    })

    describe('and the tournament is cancelled', () => {
      beforeEach(() => {
        tournament.cancelled = true
        component = shallow(<SeriesAndTeams tournament={tournament}/>)
      })

      it('does not render message about matches', () => {
        expect(component.find('.message.message--warning')).toHaveLength(0)
      })
    })
  })

  describe('when one age group without teams', () => {
    beforeEach(() => {
      tournament = { ageGroups: [{ id: 1, name: 'T07' }], cancelled: false, clubs: [], groups: [], teams: [] }
      component = shallow(<SeriesAndTeams tournament={tournament}/>)
    })

    it('renders age group with generic title', () => {
      expect(component.find('.series-and-teams__age-group .title-2').text()).toEqual('Ilmoittautuneet joukkueet')
    })

    it('renders tournament level message about no teams', () => {
      expect(component.find('.series-and-teams__no-teams').text()).toEqual('Turnaukseen ei ole ilmoittautunut vielä yhtään joukkuetta')
    })
  })

  describe('when one age group with teams in one group', () => {
    beforeEach(() => {
      tournament = {
        ageGroups: [{ id: 1, name: 'T07' }],
        cancelled: false,
        clubs: [],
        groups: [
          { ageGroupId: 1, id: 20, name: 'A' }
        ],
        teams: [
          { ageGroupId: 1, clubId: 100, groupId: 20, id: 10, name: 'FC Team 1' },
          { ageGroupId: 1, clubId: 100, groupId: 20, id: 11, name: 'SC Team 1' }
        ],
      }
      component = shallow(<SeriesAndTeams tournament={tournament}/>)
    })

    it('renders age group with generic title', () => {
      expect(component.find('.series-and-teams__age-group .title-2').text()).toEqual('Ilmoittautuneet joukkueet')
    })

    it('renders teams for the age group without group name', () => {
      const teams = component.find('.series-and-teams__team')
      expect(teams.length).toEqual(2)
      expect(teams.at(0).find('Team').prop('name')).toEqual('FC Team 1')
      expect(teams.at(1).find('Team').prop('name')).toEqual('SC Team 1')
      expect(component.find('.series-and-teams__group-title')).toHaveLength(0)
    })
  })

  describe('when two age group with the other having teams in multiple groups', () => {
    beforeEach(() => {
      tournament = {
        ageGroups: [
          { id: 1, name: 'T07' },
          { id: 2, name: 'T08' }
        ],
        cancelled: false,
        clubs: [],
        groups: [
          { ageGroupId: 1, id: 10, name: 'A' },
          { ageGroupId: 1, id: 11, name: 'B' },
          { ageGroupId: 1, id: 12, name: 'C' }
        ],
        teams: [
          { ageGroupId: 1, clubId: 100, groupId: 10, id: 10, name: 'FC Team 1' },
          { ageGroupId: 1, clubId: 100, groupId: 11, id: 11, name: 'SC Team 1' },
          { ageGroupId: 5, clubId: 100, groupId: 10, id: 12, name: 'SC Team 2' }
        ],
      }
      component = shallow(<SeriesAndTeams tournament={tournament}/>)
    })

    it('renders age group names as titles', () => {
      const ageGroups = component.find('.series-and-teams__age-group')
      expect(ageGroups.length).toEqual(2)
      expect(ageGroups.at(0).find('.title-2').text()).toEqual('T07')
      expect(ageGroups.at(1).find('.title-2').text()).toEqual('T08')
    })

    it('renders age group with those groups that have teams', () => {
      const ageGroupsWithTeams = component.find('.series-and-teams__age-group').at(0)
      const groups = ageGroupsWithTeams.find('.series-and-teams__group')
      expect(groups.length).toEqual(2)
      expect(groups.at(0).find('.series-and-teams__group-title').text()).toEqual('A')
      expect(groups.at(1).find('.series-and-teams__group-title').text()).toEqual('B')
    })

    it('renders team names inside the groups', () => {
      const ageGroupsWithTeams = component.find('.series-and-teams__age-group').at(0)
      const groups = ageGroupsWithTeams.find('.series-and-teams__group')
      const group1Teams = groups.at(0).find('.series-and-teams__team')
      expect(group1Teams.length).toEqual(2)
      expect(group1Teams.at(0).find('Team').prop('name')).toEqual('FC Team 1')
      expect(group1Teams.at(1).find('Team').prop('name')).toEqual('SC Team 2')
      const group2Teams = groups.at(1).find('.series-and-teams__team')
      expect(group2Teams.length).toEqual(1)
      expect(group2Teams.at(0).find('Team').prop('name')).toEqual('SC Team 1')
    })

    it('renders age group level message about no teams', () => {
      const ageGroupWithoutTeams = component.find('.series-and-teams__age-group').at(1)
      const noTeamsMsg = 'Sarjaan ei ole ilmoittautunut vielä yhtään joukkuetta'
      expect(ageGroupWithoutTeams.find('.series-and-teams__no-teams').text()).toEqual(noTeamsMsg)
    })
  })
})
