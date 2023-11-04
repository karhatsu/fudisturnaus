require 'rails_helper'

RSpec.describe PlayoffMatch, type: :model do
  describe 'team assignment' do
    let(:tournament) { create :tournament }
    let(:age_group) { create :age_group, tournament: tournament, calculate_group_tables: true }
    let(:group_a) { create :group, age_group: age_group, name: 'A' }
    let(:group_b) { create :group, age_group: age_group, name: 'B' }
    let(:team_a1) { create :team, group: group_a, name: 'A1' }
    let(:team_a2) { create :team, group: group_a, name: 'A2' }
    let(:team_b1) { create :team, group: group_b, name: 'B1' }
    let(:team_b2) { create :team, group: group_b, name: 'B2' }
    let!(:match_a) { create :group_stage_match, group: group_a, home_team: team_a1, away_team: team_a2, home_goals: 1, away_goals: 0 }
    let!(:match_b) { create :group_stage_match, group: group_b, home_team: team_b1, away_team: team_b2, home_goals: 1, away_goals: 0 }

    context 'when playoff match is created after all group results are available' do
      let(:semifinal_1) { create :playoff_match, home_team_origin: group_a, home_team_origin_rule: 1, away_team_origin: group_b, away_team_origin_rule: 2 }
      let(:semifinal_2) { create :playoff_match, home_team_origin: group_b, home_team_origin_rule: 1, away_team_origin: group_a, away_team_origin_rule: 2 }

      it 'assigns the teams for the match right away' do
        expect(semifinal_1.home_team_id).to eql team_a1.id
        expect(semifinal_1.away_team_id).to eql team_b2.id
        expect(semifinal_2.home_team_id).to eql team_b1.id
        expect(semifinal_2.away_team_id).to eql team_a2.id
      end

      context 'when the assignment rules are changed' do
        before do
          semifinal_1.home_team_origin = group_b
          semifinal_1.home_team_origin_rule = 2
          semifinal_1.away_team_origin = group_a
          semifinal_1.away_team_origin_rule = 1
          semifinal_1.save
        end

        it 'reassigns the teams for the match' do
          expect(semifinal_1.home_team_id).to eql team_b2.id
          expect(semifinal_1.away_team_id).to eql team_a1.id
        end
      end

      context 'and the assignment is changed to a group that has no results yet' do
        let(:group_c) { create :group, age_group: age_group, name: 'C' }

        before do
          semifinal_1.home_team_origin = group_c
          semifinal_1.away_team_origin = group_c
          semifinal_1.save
        end

        it 'resets the team assignments' do
          expect(semifinal_1.home_team_id).to be_nil
          expect(semifinal_1.away_team_id).to be_nil
        end
      end

      context 'when 2nd round playoff matches are created before the 1st round matches have results' do
        let(:final) { create :playoff_match, home_team_origin: semifinal_1,home_team_origin_rule: PlayoffMatch::RULE_WINNER,
                             away_team_origin: semifinal_2, away_team_origin_rule: PlayoffMatch::RULE_WINNER }
        let(:bronze) { create :playoff_match, home_team_origin: semifinal_1,home_team_origin_rule: PlayoffMatch::RULE_LOSER,
                              away_team_origin: semifinal_2, away_team_origin_rule: PlayoffMatch::RULE_LOSER }

        it 'does not assign the teams for the match' do
          expect(final.home_team_id).to be_nil
          expect(final.away_team_id).to be_nil
          expect(bronze.home_team_id).to be_nil
          expect(bronze.away_team_id).to be_nil
        end

        context 'and the 1st round matches get the results' do
          before do
            semifinal_1.home_goals = 5
            semifinal_1.away_goals = 6
            semifinal_1.save
            semifinal_2.home_goals = 3
            semifinal_2.away_goals = 2
            semifinal_2.save
          end

          it 'assigns the teams to the 2nd round matches' do
            final.reload
            expect(final.home_team_id).to eql team_b2.id
            expect(final.away_team_id).to eql team_b1.id
            bronze.reload
            expect(bronze.home_team_id).to eql team_a1.id
            expect(bronze.away_team_id).to eql team_a2.id
          end
        end
      end

      context 'when the 1st round matches get the results' do
        before do
          semifinal_1.home_goals = 2
          semifinal_1.away_goals = 1
          semifinal_1.save
          semifinal_2.home_goals = 3
          semifinal_2.away_goals = 4
          semifinal_2.save
        end

        context 'and 2nd round playoff match is created after that' do
          let(:final) { create :playoff_match, home_team_origin: semifinal_1,home_team_origin_rule: PlayoffMatch::RULE_WINNER,
                               away_team_origin: semifinal_2, away_team_origin_rule: PlayoffMatch::RULE_WINNER }
          let(:bronze) { create :playoff_match, home_team_origin: semifinal_1,home_team_origin_rule: PlayoffMatch::RULE_LOSER,
                                away_team_origin: semifinal_2, away_team_origin_rule: PlayoffMatch::RULE_LOSER }

          it 'assigns the teams for the match right away' do
            expect(final.home_team_id).to eql team_a1.id
            expect(final.away_team_id).to eql team_a2.id
            expect(bronze.home_team_id).to eql team_b2.id
            expect(bronze.away_team_id).to eql team_b1.id
          end

          context 'and the assignment rules are changed' do
            before do
              final.home_team_origin = semifinal_2
              final.away_team_origin = semifinal_1
              final.save
            end

            it 'reassigns the teams for the match' do
              expect(final.home_team_id).to eql team_a2.id
              expect(final.away_team_id).to eql team_a1.id
            end
          end

          context 'and the assignment rules are changed to refer playoff match that is not played yet' do
            let(:playoff_match) { create :playoff_match, home_team_origin: group_a, home_team_origin_rule: 1, away_team_origin: group_b, away_team_origin_rule: 1 }

            before do
              final.home_team_origin = playoff_match
              final.home_team_origin_rule = PlayoffMatch::RULE_WINNER
              final.away_team_origin = playoff_match
              final.away_team_origin_rule = PlayoffMatch::RULE_LOSER
              final.save!
            end

            it 'resets the team assignments' do
              expect(final.home_team_id).to be_nil
              expect(final.away_team_id).to be_nil
            end
          end
        end
      end
    end
  end
end
