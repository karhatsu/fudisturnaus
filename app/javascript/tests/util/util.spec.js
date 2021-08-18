import { buildTournamentFromSocketData } from '../../src/util/util'

describe('util', () => {
  describe('buildTournamentFromSocketData', () => {
    const groupStageMatchId = 12
    const groupId = 5
    const playoffMatch1Id = 81
    const playoffMatch2Id = 82
    let tournament

    beforeEach(() => {
      tournament = {
        name: 'Test tournament',
        groupStageMatches: [
          {
            id: groupStageMatchId - 1,
            groupId: 10,
          },
          {
            awayGoals: null,
            group: { name: 'A' },
            groupId,
            homeGoals: null,
            homeTeam: { id: 25, name: 'FC Kontu Sininen', clubId: 1 },
            id: groupStageMatchId,
            startTime: '2019-05-11T05:20:00.000Z',
          }
        ],
        groups: [
          {
            ageGroup: { name: 'P08 Haaste' },
            ageGroupId: 5,
            id: groupId,
            name: 'A',
            results: [],
          },
          {
            anotherGroup: 'is here',
            id: groupId + 1,
            results: [{ existing: 'result' }],
          }
        ],
        playoffMatches: [
          {
            id: playoffMatch1Id,
            startTime: '12:30',
          },
          {
            id: playoffMatch1Id * 10,
            startTime: '13:00',
          },
          {
            id: playoffMatch2Id,
            startTime: '13:30',
          }
        ],
      }
    })

    it('returns different tournament object', () => {
      const emptyTournament = {}
      expect(buildTournamentFromSocketData(emptyTournament, {}) === emptyTournament).toBeFalsy()
    })

    describe('for group stage match result', () => {
      const groupStageMatchId = 12
      const homeGoals = 5
      const awayGoals = 2
      let data

      beforeEach(() => {
        data = {
          groupId,
          groupStageMatch: {
            id: groupStageMatchId,
            homeGoals,
            awayGoals,
          },
          groupResults: [
            { teamName: 'Team 1', points: 6 },
            { teamName: 'Team 2', points: 3 }
          ],
          resolvedPlayoffMatches: [
            {
              id: playoffMatch1Id,
              homeTeam: {
                id: 123,
                name: 'Home team 1',
              },
              awayTeam: {
                id: 234,
                name: 'Away team 1',
              },
            },
            {
              id: playoffMatch2Id,
              homeTeam: {
                id: 123,
                name: 'Home team 2',
              },
              awayTeam: {
                id: 234,
                name: 'Away team 2',
              },
            }
          ],
        }
      })

      it('updates the group stage match result and group results and sets teams for the resolved playoff matches', () => {
        expect(buildTournamentFromSocketData(tournament, data)).toEqual({
          ...tournament,
          groupStageMatches: [
            tournament.groupStageMatches[0],
            {
              ...tournament.groupStageMatches[1],
              homeGoals,
              awayGoals,
            }
          ],
          groups: [
            {
              ...tournament.groups[0],
              results: data.groupResults,
            },
            tournament.groups[1]
          ],
          playoffMatches: [
            {
              ...tournament.playoffMatches[0],
              ...data.resolvedPlayoffMatches[0],
            },
            tournament.playoffMatches[1],
            {
              ...tournament.playoffMatches[2],
              ...data.resolvedPlayoffMatches[1],
            }
          ],
        })
      })
    })

    describe('for playoff match result', () => {
      const homeGoals = 1
      const awayGoals = 2
      let data

      beforeEach(() => {
        data = {
          groupId,
          playoffMatch: {
            id: playoffMatch1Id,
            homeGoals,
            awayGoals,
            penalties: true,
          },
          resolvedPlayoffMatches: [
            {
              id: playoffMatch2Id,
              homeTeam: {
                id: 123,
                name: 'Home team 1',
              },
              awayTeam: {
                id: 234,
                name: 'Away team 1',
              },
            }
          ],
        }
      })

      it('updates the playoff match result and sets teams for the resolved playoff matches', () => {
        expect(buildTournamentFromSocketData(tournament, data)).toEqual({
          ...tournament,
          playoffMatches: [
            {
              ...tournament.playoffMatches[0],
              homeGoals,
              awayGoals,
              penalties: true,
            },
            tournament.playoffMatches[1],
            {
              ...tournament.playoffMatches[2],
              ...data.resolvedPlayoffMatches[0],
            }
          ],
        })
      })
    })
  })
})
