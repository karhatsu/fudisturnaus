require 'rails_helper'

RSpec.describe PlayoffGroup, type: :model do
  describe '#results' do
    let(:playoff_group) { create :playoff_group }
    let(:group1) { create :group }
    let(:group2) { create :group }

    context 'when no matches for playoff group' do
      it 'returns empty array' do
        expect(playoff_group.results).to eql []
      end
    end

    context 'when playoff matches for the group' do
      let!(:match1) { create :playoff_match, playoff_group: playoff_group, home_team_origin: group1, away_team_origin: group2 }
      let!(:match2) { create :playoff_match, playoff_group: playoff_group, home_team_origin: group2, away_team_origin: group1 }
      let(:team1) { create :team, name: 'AC Greens' }
      let(:team2) { create :team, name: 'FC Reds' }

      context 'but no teams for the matches' do
        it 'returns empty array' do
          expect(playoff_group.results).to eql []
        end
      end

      context 'and teams for the matches' do
        before do
          match1.home_team = team1
          match1.away_team = team2
          match1.save!
          match2.home_team = team2
          match2.away_team = team1
          match2.save!
        end

        context 'but no results' do
          it 'returns the teams ordered by name' do
            results = playoff_group.results
            expect_ranking results, 0, 1, team1
            expect_ranking results, 1, 1, team2
          end
        end

        context 'and results' do
          before do
            match1.home_goals = 2
            match1.away_goals = 3
            match1.save!
            match2.home_goals = 2
            match2.away_goals = 1
            match2.save!
          end

          it 'returns the teams ordered by points' do
            results = playoff_group.results
            expect_ranking results, 0, 1, team2
            expect_ranking results, 1, 2, team1
            expect(results[0].points).to eql 6
            expect(results[1].losses).to eql 2
          end
        end
      end
    end

    def expect_ranking(results, index, ranking, team)
      expect(results[index].ranking).to eql ranking
      expect(results[index].team).to eql team
    end
  end
end
