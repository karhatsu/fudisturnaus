require 'rails_helper'

RSpec.describe Tournament, type: :model do
  describe '#dates' do
    context 'on tournament creation' do
      it 'sets start date for 1 day tournament' do
        expect(create(:tournament, days: 1, start_date: '2025-05-15').dates).to eql(['2025-05-15'])
      end

      it 'sets correct dates for 3 days tournament' do
        expect(create(:tournament, days: 3, start_date: '2025-05-14').dates).to eql(%w[2025-05-14 2025-05-15 2025-05-16])
      end

      it 'sets start date value when distinct days will be used' do
        expect(create(:tournament, days: 0, start_date: '2025-05-31').dates).to eql(['2025-05-31'])
      end
    end

    describe 'on tournament update' do
      context 'when days count in use' do
        let(:tournament) { create :tournament, days: 1, start_date: '2025-05-18' }

        it 'updates dates field on days number change' do
          tournament.update_attribute :days, 2
          expect(tournament.dates).to eql(%w[2025-05-18 2025-05-19])
        end

        it 'updates dates field on start date change' do
          tournament.update_attribute :start_date, '2025-07-15'
          expect(tournament.dates).to eql(['2025-07-15'])
        end
      end

      context 'when distinct days are in use' do
        let(:tournament) { create :tournament, days: 0, start_date: '2025-06-01' }
        let(:age_group) { create :age_group, tournament: tournament }
        let(:group) { create :group, age_group: age_group }
        let(:team1) { create :team, group: group }
        let(:team2) { create :team, group: group }

        context 'when group match is created' do
          before do
            tournament.reload
            @gsm = create :group_stage_match, group: group, start_time: '2025-06-10', home_team: team1, away_team: team2
          end

          it 'updates the dates field' do
            expect(tournament.reload.dates).to eql(%w[2025-06-01 2025-06-10])
          end

          context 'when the match time is changed to another date' do
            before do
              @gsm.reload.update_attribute :start_time, '2025-06-11'
            end

            it 'updates the dates field' do
              expect(tournament.reload.dates).to eql(%w[2025-06-01 2025-06-11])
            end
          end
        end

        context 'when playoff match is created' do
          before do
            tournament.reload
            @pom = create :playoff_match, age_group: age_group, start_time: '2025-06-03',
                          home_team_origin: group, home_team_origin_rule: 1, away_team_origin: group, away_team_origin_rule: 2
          end

          it 'updates the dates field' do
            expect(tournament.reload.dates).to eql(%w[2025-06-01 2025-06-03])
          end

          context 'when the match time is changed to another date' do
            before do
              @pom.reload.update_attribute :start_time, '2025-07-01'
            end

            it 'updates the dates field' do
              expect(tournament.reload.dates).to eql(%w[2025-06-01 2025-07-01])
            end
          end
        end
      end
    end
  end

  describe 'update' do
    let(:tournament) { create :tournament, start_date: '2019-09-25', days: 2 }
    let(:age_group) { create :age_group, tournament: tournament }
    let(:group) { create :group, age_group: age_group }
    let(:team1) { create :team, group: group, name: 'Team 1' }
    let(:team2) { create :team, group: group, name: 'Team 2' }
    let(:group_stage_match1) { create :group_stage_match, group: group, start_time: '2019-09-25T10:45', home_team: team1, away_team: team2 }
    let(:group_stage_match2) { create :group_stage_match, group: group, start_time: '2019-09-26T11:00', home_team: team2, away_team: team1 }
    let(:playoff_match1) { create :playoff_match, age_group: age_group, start_time: '2019-09-25T13:30', home_team_origin: group, away_team_origin: group }
    let(:playoff_match2) { create :playoff_match, age_group: age_group, start_time: '2019-09-26T18:11', home_team_origin: group, away_team_origin: group }

    before do
      group_stage_match1
      group_stage_match2
      playoff_match1
      playoff_match2
    end

    context 'when tournament date does not change' do
      before do
        tournament.update(name: 'New name')
      end

      it 'keeps the same dates in group stage matches' do
        matches = tournament.group_stage_matches
        expect_time(matches[0].start_time, '2019-09-25T10:45')
        expect_time(matches[1].start_time, '2019-09-26T11:00')
      end

      it 'keeps the same dates in playoff matches' do
        matches = tournament.playoff_matches
        expect_time(matches[0].start_time, '2019-09-25T13:30')
        expect_time(matches[1].start_time, '2019-09-26T18:11')
      end
    end

    context 'when tournament date changes' do
      before do
        tournament.update(start_date: '2019-09-11')
      end

      it 'automatically adjusts group stage match dates' do
        matches = tournament.group_stage_matches
        expect_time(matches[0].start_time, '2019-09-11T10:45')
        expect_time(matches[1].start_time, '2019-09-12T11:00')
      end

      it 'automatically adjusts playoff match dates' do
        matches = tournament.playoff_matches
        expect_time(matches[0].start_time, '2019-09-11T13:30')
        expect_time(matches[1].start_time, '2019-09-12T18:11')
      end
    end

    def expect_time(date_time, expected)
      expect(date_time.strftime('%Y-%m-%dT%H:%M')).to eq(expected)
    end
  end
end
