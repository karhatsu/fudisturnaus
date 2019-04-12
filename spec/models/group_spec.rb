require 'rails_helper'

RSpec.describe Group, type: :model do
  describe '#results' do
    let(:calculate_group_tables) { true }
    let(:age_group) { create :age_group, calculate_group_tables: calculate_group_tables }
    let(:group) { build :group, age_group: age_group }
    let(:team1) { double Team, id: 1, name: 'Team 1' }
    let(:team2) { double Team, id: 2, name: 'Team 2' }
    let(:team3) { double Team, id: 3, name: 'Team 3' }
    let(:team4) { double Team, id: 4, name: 'Team 4' }

    before do
      allow(group).to receive(:teams).and_return([team4, team3, team2, team1])
    end

    context 'when group tables are not calculated for the age group' do
      let(:calculate_group_tables) { false }

      it 'returns empty array' do
        expect(group.results).to eql []
      end
    end

    context 'when no match results' do
      before do
        mock_results team1
        mock_results team2
        mock_results team3
        mock_results team4
      end

      it 'returns teams sorted by their names' do
        expect_results [team1, team2, team3, team4]
      end

      it 'sets ranking #1 for all teams' do
        expect_rankings [1, 1, 1, 1]
      end
    end

    context 'when match results' do
      before do
        mock_results team4, 5, +10, 8
        mock_results team2, 5, +9, 10
        mock_results team1, 4, +11, 11
        mock_results team3, 4, +11, 10
      end

      it 'returns teams sorted by points, goals difference, goals for and team name' do
        expect_results [team4, team2, team1, team3]
      end

      it 'sets rankings for teams' do
        expect_rankings [1, 2, 3, 4]
      end
    end

    context 'when some teams have equal results' do
      context 'and lottery has not been done' do
        before do
          mock_results team4, 5, +10, 8
          mock_results team2, 4, +11, 11
          mock_results team1, 4, +11, 11
          mock_results team3, 4, +11, 10
        end

        it 'returns teams sorted by points, goals difference, goals for and team name' do
          expect_results [team4, team1, team2, team3]
        end

        it 'sets equal rankings for teams having equal numbers' do
          expect_rankings [1, 2, 2, 4]
        end
      end

      context 'and lottery has been done' do
        before do
          mock_results team4, 5, +10, 8
          mock_results team2, 4, +11, 11, 1
          mock_results team1, 4, +11, 11, 0
          mock_results team3, 4, +11, 10
        end

        it 'takes lottery into account' do
          expect_results [team4, team2, team1, team3]
        end

        it 'sets own rankings for teams having equal numbers' do
          expect_rankings [1, 2, 3, 4]
        end
      end
    end

    context 'when some teams end up into similar results' do
      let(:age_group) { create :age_group, calculate_group_tables: true }
      let(:groupX) { create :group, age_group: age_group }
      let(:teamA) { create :team, name: 'Team A', group: groupX }
      let(:teamB) { create :team, name: 'Team B', group: groupX }
      let(:teamC) { create :team, name: 'Team C', group: groupX }
      let(:teamD) { create :team, name: 'Team D', group: groupX }

      before do
        create_match teamA, teamB, 2, 0
        create_match teamA, teamC, 2, 1
        create_match teamA, teamD, 0, 0
        create_match teamB, teamC, 3, 0
        create_match teamB, teamD, 0, 3
        create_match teamC, teamD, 2, 0
      end

      it 'compares the matches of only those teams to define the ranking' do
        results = groupX.reload.results
        expect_result results, 1, teamA # 4-1 7
        expect_result results, 2, teamD # 3-2 4
        expect_result results, 3, teamB # 3-5 3 but B-C 3-0
        expect_result results, 4, teamC # 3-5 3
      end

      def create_match(home_team, away_team, home_goals, away_goals)
        create :group_stage_match, group: group, home_team: home_team, away_team: away_team, home_goals: home_goals, away_goals: away_goals
      end

      def expect_result(results, ranking, team)
        expect(results[ranking - 1].ranking).to eql ranking
        expect(results[ranking - 1].team).to eql team
      end
    end

    def expect_results(teams)
      expect(group.results.map(&:team_name)).to eql teams.map(&:name)
    end

    def expect_rankings(rankings)
      expect(group.results.map(&:ranking)).to eql rankings
    end

    def mock_results(team, points = 0, goals_difference = 0, goals_for = 0, lot = nil)
      fake_results = FakeTeamGroupResults.new(team, points, goals_difference, goals_for, lot)
      allow(team).to receive(:group_results).and_return(fake_results)
    end
  end

  describe '#populate_first_round_playoff_matches' do
    let(:age_group) { create :age_group, calculate_group_tables: true }
    let(:groupA) { create :group, age_group: age_group, name: 'A' }
    let(:groupB) { create :group, age_group: age_group, name: 'B' }
    let(:team1) { create :team, group: groupA, name: 'Team 1' }
    let(:team2) { create :team, group: groupA, name: 'Team 2' }
    let(:team3) { create :team, group: groupA, name: 'Team 3' }
    let!(:match1) { create :group_stage_match, group: groupA, home_team: team1, away_team: team2, home_goals: 1, away_goals: 0 }
    let!(:match2) { create :group_stage_match, group: groupA, home_team: team2, away_team: team3, home_goals: 1, away_goals: 0 }
    let!(:match3) { create :group_stage_match, group: groupA, home_team: team3, away_team: team1 }
    let!(:playoff_match1) { create :playoff_match, age_group: age_group,
                                  home_team_origin: groupA, home_team_origin_rule: 1,
                                  away_team_origin: groupB, away_team_origin_rule: 2 }
    let!(:playoff_match2) { create :playoff_match, age_group: age_group,
                                  home_team_origin: groupB, home_team_origin_rule: 1,
                                  away_team_origin: groupA, away_team_origin_rule: 2 }

    context 'when no results for all matches' do
      it 'returns empty array' do
        expect(groupA.populate_first_round_playoff_matches).to eql []
      end
    end

    context 'when results for all matches' do
      context 'but results lead to equal rankings' do
        before do
          match3.update_column :home_goals, 1
          match3.update_column :away_goals, 0
          groupA.reload
        end

        it 'returns empty array' do
          expect(groupA.populate_first_round_playoff_matches).to eql []
        end
      end

      context 'and group results are complete and playoff matches refer to this group' do
        before do
          match3.update_column :home_goals, 3
          match3.update_column :away_goals, 1
          groupA.reload
        end

        it 'defines home and away teams' do
          groupA.populate_first_round_playoff_matches
          expect(playoff_match1.reload.home_team.name).to eql 'Team 3'
          expect(playoff_match1.away_team).to be_nil
          expect(playoff_match2.reload.home_team).to be_nil
          expect(playoff_match2.away_team.name).to eql 'Team 2'
        end

        it 'returns the matches that were defined' do
          expect(groupA.populate_first_round_playoff_matches.map(&:id)).to eq [playoff_match1.id, playoff_match2.id]
        end
      end
    end
  end
end

class FakeTeamGroupResults
  attr_reader :team, :team_id, :team_name, :lot
  attr_accessor :ranking, :relative_points

  def initialize(team, points, goals_difference, goals_for, lot)
    @team = team
    @team_id = team.id
    @team_name = team.name
    @relative_points = TeamGroupResults.relative_points points, goals_difference, goals_for
    @lot = lot
  end

  def to_s
    "#{team_name}: #{ranking}. (#{relative_points})"
  end
end
