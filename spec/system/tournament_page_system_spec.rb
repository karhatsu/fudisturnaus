require 'rails_helper'

describe 'tournament page', type: :system do
  let(:name) { 'Test tournament' }
  let(:location) { 'Test pitch' }
  let(:address) { 'Test street 24 B 00940 Test city' }
  let(:start_date) { '2019-06-01' }
  let(:formatted_date) { '01.06.2019' }
  let!(:tournament) { create :tournament, name: name, location: location, address: address, start_date: start_date }

  before do
    driven_by :selenium, using: :headless_chrome
  end

  it 'shows basic tournament info' do
    visit '/'
    expect(page.find('.tournament-link__tournament-name').text).to eql name
    expect(page.find('.tournament-link__other-info').text).to eql "#{location}, #{formatted_date}"
    click_link name
    expect(page).to have_current_path("/tournaments/#{tournament.id}")
    expect(page.find('.title__text').text).to eql name
    expect(page.find('.sub-title').text).to eql "#{location}, #{formatted_date}"
    expect(page.find('.sub-title a').text).to eql location
    expect(page.find('.sub-title a')[:href]).to eql "https://www.google.com/maps/place/#{address.gsub(' ', '+')}"
    expect(page.find('.message.message--error').text).to eql 'Turnauksen otteluohjelmaa ei ole vielä julkistettu'
  end

  describe 'when matches added' do
    let(:field1) { create :field, name: 'Field 1', tournament: tournament }
    let(:field2) { create :field, name: 'Field 2', tournament: tournament }
    let(:age_group) { create :age_group, name: 'P11', calculate_group_tables: true, tournament: tournament }
    let(:group1) { create :group, name: 'Group A', age_group: age_group }
    let(:group2) { create :group, name: 'Group B', age_group: age_group }
    let(:club1) { create :club, name: 'FC Football' }
    let(:club2) { create :club, name: 'Soccer SC' }
    let(:club3) { create :club, name: 'FC Third Club' }
    let(:team1) { create :team, name: 'FC Football Green', club: club1, group: group1 }
    let(:team2) { create :team, name: 'Soccer SC Yellow', club: club2, group: group1 }
    let!(:team3) { create :team, name: 'FC Another Club Orange', club: club3, group: group1 }
    let(:team4) { create :team, name: 'Soccer SC Red', club: club2, group: group2 }
    let(:team5) { create :team, name: 'FC Another Club Blue', club: club3, group: group2 }
    let(:match1_start_time) { '10:00' }
    let(:start_time1) { "#{start_date}T#{match1_start_time}:00+03:00" }
    let(:match2_start_time) { '10:30' }
    let(:start_time2) { "#{start_date}T#{match2_start_time}:00+03:00" }
    let(:match3_start_time) { '10:30' }
    let(:start_time3) { "#{start_date}T#{match3_start_time}:00+03:00" }
    let!(:match1) { create :group_stage_match, field: field1, group: group1, home_team: team1, away_team: team2, start_time: start_time1 }

    it 'shows match info' do
      visit "/tournaments/#{tournament.id}"
      expect(page.find('.match .match__start-time').text).to eql "#{match1_start_time}"
      expect(page.find('.match .match__details').text).to eql "#{field1.name}, #{age_group.name}, #{group1.name}"
      expect(page.find('.match .match__teams').text).to eql "#{team1.name}-#{team2.name}"
    end

    it 'shows group tables' do
      visit "/tournaments/#{tournament.id}"
      expect(page.all('.group-results__group tbody tr').length).to eql group1.teams.count
      group1.teams.sort {|a, b| a.name <=> b.name }.each_with_index do |team, row_index|
        expect_group_table_row row_index, team.name
      end
    end

    describe 'when match result saved' do
      before do
        match1.home_goals = 4
        match1.away_goals = 2
        match1.save!
        visit "/tournaments/#{tournament.id}"
      end

      it 'shows the result' do
        expect_result '4 - 2'
      end

      it 'updates group tables' do
        expect_group_table_row 0, team1.name, 1, 1, 0, 0, 4, 2, 3
        expect_group_table_row 1, team3.name
        expect_group_table_row 2, team2.name, 1, 0, 0, 1, 2, 4, 0
      end
    end

    describe 'filters' do
      let!(:match2) { create :group_stage_match, field: field2, group: group1, home_team: team3, away_team: team1, start_time: start_time2 }
      let!(:match3) { create :group_stage_match, field: field1, group: group2, home_team: team4, away_team: team5, start_time: start_time3 }

      it 'shows correct matches based on selection' do
        visit "/tournaments/#{tournament.id}"
        expect_match_count 3

        select field2.name, from: 'filter-fieldId'
        expect_one_match team3, team1
        select 'Kenttä', from: 'filter-fieldId'

        select club2.name, from: 'filter-clubId'
        expect_match_count 2

        select team4.name, from: 'filter-teamId'
        expect_one_match team4, team5

        select 'Seura', from: 'filter-clubId'
        select 'Joukkue', from: 'filter-teamId'
        select group1.name, from: 'filter-groupId'
        expect_match_count 2
      end

      def expect_one_match(home_team, away_team)
        expect_match_count 1
        expect(page.find('.match .match__teams').text).to eql "#{home_team.name}-#{away_team.name}"
      end

      def expect_match_count(expected_count)
        expect(page).to have_selector('.match', count: expected_count)
      end
    end
  end
end
