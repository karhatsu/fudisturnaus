require 'rails_helper'

RSpec.describe Team, type: :model do
  describe '#results' do
    let(:calculate_group_tables) { true }
    let(:age_group) { create :age_group, calculate_group_tables: calculate_group_tables }
    let(:group) { build :group, age_group: age_group }
    let(:team1) { double Team, name: 'Team 1' }
    let(:team2) { double Team, name: 'Team 2' }
    let(:team3) { double Team, name: 'Team 3' }
    let(:team4) { double Team, name: 'Team 4' }

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

    def expect_results(teams)
      expect(group.results.map(&:team_name)).to eql teams.map(&:name)
    end

    def expect_rankings(rankings)
      expect(group.results.map(&:ranking)).to eql rankings
    end

    def mock_results(team, points = 0, goals_difference = 0, goals_for = 0)
      fake_results = FakeTeamGroupResults.new(team, points, goals_difference, goals_for)
      allow(team).to receive(:group_results).and_return(fake_results)
    end
  end
end

class FakeTeamGroupResults
  attr_reader :team, :team_name, :relative_points
  attr_accessor :ranking

  def initialize(team, points, goals_difference, goals_for)
    @team = team
    @team_name = team.name
    @relative_points = TeamGroupResults.relative_points points, goals_difference, goals_for
  end
end
