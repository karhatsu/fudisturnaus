require 'rails_helper'

RSpec.describe Group, type: :model do
  describe '#results' do
    let(:tournament) { create :tournament, equal_points_rule: Tournament::EQUAL_POINTS_RULE_ALL_MATCHES_FIRST }
    let(:calculate_group_tables) { true }
    let(:age_group) { create :age_group, tournament: tournament, calculate_group_tables: calculate_group_tables }
    let(:group) { create :group, age_group: age_group }
    let!(:team1) { create :team, group: group, name: 'Team 1' }
    let!(:team2) { create :team, group: group, name: 'Team 2' }
    let!(:team3) { create :team, group: group, name: 'Team 3' }
    let!(:team4) { create :team, group: group, name: 'Team 4' }

    context 'when group tables are not calculated for the age group' do
      let(:calculate_group_tables) { false }

      it 'returns empty array' do
        expect(group.results).to eql []
      end
    end

    context 'when no match results' do
      it 'sets ranking #1 for all teams and sorts teams by name' do
        results = group.reload.results
        expect_ranking results, 0, 1, team1
        expect_ranking results, 1, 1, team2
        expect_ranking results, 2, 1, team3
        expect_ranking results, 3, 1, team4
      end
    end

    context 'when match results' do
      before do
        create_match team1, team2, 1, 0
        create_match team1, team3, 0, 3
        create_match team1, team4, 10, 0
        create_match team2, team3, 2, 0
        create_match team2, team4, 5, 0
        create_match team3, team4, 1, 0
      end

      context 'and all matches first is used as equal points rule' do
        it 'returns teams sorted by points, goals difference, goals for' do
          results = group.reload.results
          expect_ranking results, 0, 1, team1
          expect_ranking results, 1, 2, team2
          expect_ranking results, 2, 3, team3
          expect_ranking results, 3, 4, team4
        end
      end

      context 'and mutual matches first is used as equal points rule' do
        before do
          tournament.update_attribute :equal_points_rule, Tournament::EQUAL_POINTS_RULE_MUTUAL_MATCHES_FIRST
        end

        it 'returns teams sorted by points, mutual match points, goals difference, goals for' do
          results = group.reload.results
          expect_ranking results, 0, 1, team3
          expect_ranking results, 1, 2, team2
          expect_ranking results, 2, 3, team1
          expect_ranking results, 3, 4, team4
        end
      end
    end

    context 'when some teams end up to the same ranking by points, goals diff and goals for' do
      context 'but mutual matches sort the teams' do
        before do
          team2.update_attribute :name, 'Team X2' # to break the default order by name
          create_match team1, team2, 2, 0
          create_match team1, team3, 2, 1
          create_match team1, team4, 0, 0
          create_match team2, team3, 3, 0
          create_match team2, team4, 0, 3
          create_match team3, team4, 2, 0
        end

        it 'sets rankings based on mutual matches' do
          results = group.reload.results
          expect_ranking results, 0, 1, team1 # 4-1 7
          expect_ranking results, 1, 2, team4 # 3-2 4
          expect_ranking results, 2, 3, team2 # 3-5 3 but B-C 3-0
          expect_ranking results, 3, 4, team3 # 3-5 3
        end
      end

      context 'and mutual matches do not solve the ranking' do
        before do
          create_match team1, team2, 1, 1
          create_match team1, team3, 0, 2
          create_match team1, team4, 0, 2
          create_match team2, team3, 0, 2
          create_match team2, team4, 0, 2
          create_match team3, team4, 1, 1
        end

        context 'and lottery has not been done' do
          it 'sets equal rankings for teams having equal numbers' do
            results = group.reload.results
            expect_ranking results, 0, 1, team3
            expect_ranking results, 1, 1, team4
            expect_ranking results, 2, 3, team1
            expect_ranking results, 3, 3, team2
          end
        end

        context 'and lottery has been done' do
          before do
            team1.update_attribute :lot, 10
            team2.update_attribute :lot, 11
            team3.update_attribute :lot, 0
            team4.update_attribute :lot, 1
          end

          it 'takes lottery into account' do
            results = group.reload.results
            expect_ranking results, 0, 1, team4
            expect_ranking results, 1, 2, team3
            expect_ranking results, 2, 3, team2
            expect_ranking results, 3, 4, team1
          end
        end
      end
    end

    def create_match(home_team, away_team, home_goals, away_goals)
      create :group_stage_match, group: group, home_team: home_team, away_team: away_team, home_goals: home_goals, away_goals: away_goals
    end

    def expect_ranking(results, index, ranking, team)
      expect(results[index].ranking).to eql ranking
      expect(results[index].team).to eql team
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
