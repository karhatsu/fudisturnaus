require 'rails_helper'

RSpec.describe Team, type: :model do
  describe '#group_results' do
    let(:field) { create :field }
    let(:group) { create :group }
    let(:team) { create :team, group: group }

    context 'when no matches' do
      it 'contains only zeros' do
        expect_group_result team, 0, 0, 0, 0, 0, 0, 0
      end
    end

    context 'when matches without results' do
      let(:team2) { create :team, name: 'Team 2', group: group }
      let(:home_match1) { create :group_stage_match, field: field, home_team: team, away_team: team2 }
      let(:home_match2) { create :group_stage_match, field: field, home_team: team, away_team: team2 }
      let(:home_match3) { create :group_stage_match, field: field, home_team: team, away_team: team2 }
      let(:away_match1) { create :group_stage_match, field: field, home_team: team2, away_team: team }
      let(:away_match2) { create :group_stage_match, field: field, home_team: team2, away_team: team }
      let(:away_match3) { create :group_stage_match, field: field, home_team: team2, away_team: team }

      before do
        home_match1.reload
      end

      it 'contains only zeros' do
        expect_group_result team, 0, 0, 0, 0, 0, 0, 0
      end

      context 'when there is a match that the team has won as home team' do
        before do
          home_match1.home_goals = 2
          home_match1.away_goals = 1
          home_match1.save!
        end

        it 'returns one win' do
          expect_group_result team, 1, 1, 0, 0, 2, 1, 3
        end

        context 'and there is a match that the team has lost as home team' do
          before do
            home_match2.home_goals = 2
            home_match2.away_goals = 4
            home_match2.save!
          end

          it 'returns one win and one loss' do
            expect_group_result team, 2, 1, 0, 1, 4, 5, 3
          end

          context 'and there is a draw match as home team' do
            before do
              home_match3.home_goals = 1
              home_match3.away_goals = 1
              home_match3.save!
            end

            it 'returns one win, one draw, and one loss' do
              expect_group_result team, 3, 1, 1, 1, 5, 6, 4
            end

            context 'and there is one win, one draw, and one loss as an away team' do
              before do
                away_match1.home_goals = 4
                away_match1.away_goals = 3
                away_match1.save!
                away_match2.home_goals = 2
                away_match2.away_goals = 2
                away_match2.save!
                away_match3.home_goals = 1
                away_match3.away_goals = 10
                away_match3.save!
              end

              it 'returns one win, one draw, and one loss' do
                expect_group_result team, 6, 2, 2, 2, 20, 13, 8
              end
            end
          end
        end
      end
    end
  end

  def expect_group_result(team, matches, wins, draws, losses, goals_for, goals_against, points)
    team_group_results = team.reload.group_results
    expect(team_group_results.matches).to eq matches
    expect(team_group_results.wins).to eq wins
    expect(team_group_results.draws).to eq draws
    expect(team_group_results.losses).to eq losses
    expect(team_group_results.goals_for).to eq goals_for
    expect(team_group_results.goals_against).to eq goals_against
    expect(team_group_results.points).to eq points
  end
end
