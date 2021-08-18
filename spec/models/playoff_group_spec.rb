require 'rails_helper'

RSpec.describe PlayoffGroup, type: :model do
  describe '#results' do
    let(:playoff_group) { create :playoff_group }
    let(:group1) { create :group, name: 'A' }
    let(:group2) { create :group, name: 'B' }

    context 'when no matches for playoff group' do
      it 'returns empty array' do
        expect(playoff_group.results).to eql []
      end
    end

    context 'when playoff matches for the group' do
      let!(:match1) { create :playoff_match, playoff_group: playoff_group, home_team_origin: group1, home_team_origin_rule: 1, away_team_origin: group2, away_team_origin_rule: 1 }
      let!(:match2) { create :playoff_match, playoff_group: playoff_group, home_team_origin: group2, home_team_origin_rule: 2, away_team_origin: group1, away_team_origin_rule: 1 }
      let!(:match3) { create :playoff_match, playoff_group: playoff_group, home_team_origin: group2, home_team_origin_rule: 1, away_team_origin: group2, away_team_origin_rule: 2 }
      let(:team1) { create :team, name: 'AC Greens' } # group 1 (unfinished group)
      let(:team2) { create :team, name: 'FC Reds' } # group 2: 1st
      let(:team3) { create :team, name: 'SC Blues' } # group 2: 2nd

      context 'but no teams for the matches' do
        it 'returns unassigned teams' do
          expect(playoff_group.results.map(&:team_name)).to eq %W[#{group1.name}1 #{group2.name}1 #{group2.name}2]
        end
      end

      context 'and teams for (some of) the matches' do
        before do
          add_teams match1, nil, team2
          add_teams match2, team3, nil
          add_teams match3, team2, team3
        end

        context 'but no results' do
          it 'returns the teams and unassigned teams ordered by name' do
            expect(playoff_group.results.map(&:team_name)).to eq %W[#{group1.name}1 #{team2.name} #{team3.name}]
          end
        end

        context 'and results' do
          before do
            save_result match3, 2, 3
          end

          # should not happen in real life but testing the combination
          it 'returns the teams and unassigned team ordered by points' do
            results = playoff_group.results
            expect(results.map(&:team_name)).to eq %W[#{team3.name} #{group1.name}1 #{team2.name}]
            expect(results[0].points).to eql 3
            expect(results[2].losses).to eql 1
          end
        end
      end
    end

    def add_teams(match, home_team, away_team)
      match.home_team = home_team
      match.away_team = away_team
      match.save!
    end

    def save_result(match, home_goals, away_goals)
      match.home_goals = home_goals
      match.away_goals = away_goals
      match.save!
    end

    def expect_ranking(results, index, ranking, team)
      expect(results[index].ranking).to eql ranking
      expect(results[index].team).to eql team
    end
  end
end
