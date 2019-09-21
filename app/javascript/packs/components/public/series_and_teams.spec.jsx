import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SeriesAndTeams from './series_and_teams'

Enzyme.configure({ adapter: new Adapter() })

describe('SeriesAndTeams', () => {
  let tournament
  let component

  describe('when no age groups', () => {
    beforeEach(() => {
      tournament = { ageGroups: [], groups: [], teams: [] }
      component = shallow(<SeriesAndTeams tournament={tournament}/>)
    })

    it('renders message about matches', () => {
      expect(component.find('.message.message--warning').text()).toEqual('Turnauksen otteluohjelma julkaistaan myöhemmin')
    })

    it('does not render age groups', () => {
      expect(component.find('.series-and-teams__age-group')).toHaveLength(0)
    })
  })

  describe('when one age group without teams', () => {
    beforeEach(() => {
      tournament = { ageGroups: [{ id: 1, name: 'T07' }], groups: [], teams: [] }
      component = shallow(<SeriesAndTeams tournament={tournament}/>)
    })

    it('renders age group with generic title', () => {
      expect(component.find('.series-and-teams__age-group .title-2').text()).toEqual('Ilmoittautuneet joukkueet')
    })

    it('renders tournament level message about no teams', () => {
      expect(component.find('.series-and-teams__age-group-no-teams').text()).toEqual('Turnaukseen ei ole ilmoittautunut vielä yhtään joukkuetta')
    })
  })

  describe('when one age group with teams in one group', () => {
    beforeEach(() => {
      tournament = {
        ageGroups: [{ id: 1, name: 'T07' }],
        groups: [
          { ageGroupId: 1, id: 20, name: 'A' }
        ],
        teams: [
          { ageGroupId: 1, groupId: 20, id: 10, name: 'FC Team 1' },
          { ageGroupId: 1, groupId: 20, id: 11, name: 'SC Team 1' }
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
      expect(teams.at(0).text()).toEqual('FC Team 1')
      expect(teams.at(1).text()).toEqual('SC Team 1')
    })
  })

  describe('when two age group with the other having teams in multiple groups', () => {
    beforeEach(() => {
      tournament = {
        ageGroups: [
          { id: 1, name: 'T07' },
          { id: 2, name: 'T08' }
        ],
        groups: [
          { ageGroupId: 1, id: 10, name: 'A' },
          { ageGroupId: 1, id: 11, name: 'B' }
        ],
        teams: [
          { ageGroupId: 1, groupId: 10, id: 10, name: 'FC Team 1' },
          { ageGroupId: 1, groupId: 11, id: 11, name: 'SC Team 1' },
          { ageGroupId: 5, groupId: 10, id: 12, name: 'SC Team 2' }
        ],
      }
      component = shallow(<SeriesAndTeams tournament={tournament}/>)
    })

    it('renders age groups names as titles', () => {
      const titles = component.find('.series-and-teams__age-group .title-2')
      expect(titles.length).toEqual(2)
      expect(titles.at(0).text()).toEqual('T07')
      expect(titles.at(1).text()).toEqual('T08')
    })

    it('renders teams with group names for the age group having them', () => {
      const ageGroups = component.find('.series-and-teams__age-group')
      expect(ageGroups.length).toEqual(2)
      const teams = ageGroups.at(0).find('.series-and-teams__team')
      expect(teams.length).toEqual(2)
      expect(teams.at(0).text()).toEqual('FC Team 1 (A)')
      expect(teams.at(1).text()).toEqual('SC Team 1 (B)')
    })

    it('renders age group level message about no teams', () => {
      const ageGroups = component.find('.series-and-teams__age-group')
      expect(ageGroups.at(1).find('.series-and-teams__age-group-no-teams').text()).toEqual('Sarjaan ei ole ilmoittautunut vielä yhtään joukkuetta')
    })
  })
})
