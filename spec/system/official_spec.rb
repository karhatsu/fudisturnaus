require 'rails_helper'

describe 'official', type: :system do
  before do
    driven_by :selenium, using: :headless_chrome
  end

  describe 'access' do
    it 'allow access to official page only with correct access key' do
      tournament = create :tournament
      visit '/official/unknown-key'
      expect(page).to have_current_path '/'
      visit "/official/#{tournament.access_key}"
      expect(page).to have_current_path "/official/#{tournament.access_key}"
      expect(page.find('.title .title__text').text).to eql tournament.name
    end
  end

  describe 'tournament management' do
    before do
      @tournament = create :tournament
      @club = create :club
      visit "/official/#{@tournament.access_key}"
    end

    it 'works for new items' do
      click_link 'Muokkaa turnauksen asetuksia'

      add_new_item 'fields'
      form_inputs[0].fill_in with: 'Field 1'
      submit
      expect_item_title 'fields', 'Field 1'

      add_new_item 'age-groups'
      form_inputs[0].fill_in with: 'T11'
      submit
      expect_item_title 'age-groups', 'T11'

      add_new_item 'groups'
      form_selects[0].select 'T11'
      form_inputs[0].fill_in with: 'Group A'
      submit
      expect_item_title 'groups', 'Group A (T11)'

      add_new_item 'teams'
      form_selects[0].select 'Group A (T11)'
      form_selects[1].select @club.name
      form_inputs[0].fill_in with: 'FC Brown'
      submit
      expect_item_title 'teams', 'FC Brown'

      add_new_item 'teams', 1
      form_selects[0].select 'Group A (T11)'
      form_selects[1].select '+ Lisää uusi seura'
      page.find('.new-club-form .form__field input').fill_in with: 'SC Lions'
      page.find('.new-club-form .button--primary').click
      form_inputs[0].fill_in with: 'SC Lions Green'
      submit

      add_new_item 'group-stage-matches'
      form_selects[0].select 'Field 1'
      form_inputs[0].fill_in with: '11:30'
      form_selects[1].select 'Group A (T11)'
      form_selects[2].select 'FC Brown'
      form_selects[3].select 'SC Lions Green'
      submit
      expect_item_title 'group-stage-matches', 'Field 1 | 11:30 | Group A (T11) | FC Brown - SC Lions Green'

      click_link 'Takaisin tulosten syöttöön'
      expect_match_info_for_added_match

      visit "/tournaments/#{@tournament.id}"
      expect_match_info_for_added_match
    end

    def add_new_item(section_name, index = 0)
      page.all(".admin-tournament-page__section--#{section_name} .admin-item__title span")[index].click
    end

    def form_inputs
      page.all('.form__field input')
    end

    def form_selects
      page.all('.form__field select')
    end

    def submit
      page.find('.button--primary').click
    end

    def expect_item_title(section_name, title)
      expect(page.all(".admin-tournament-page__section--#{section_name} .admin-item__title")[0].text).to eql title
    end

    def expect_match_info_for_added_match
      expect_match_info '11:30', 'Field 1', 'T11', 'Group A', 'FC Brown', 'SC Lions Green'
    end
  end

  describe 'result saving' do
    before do
      age_group = create :age_group, calculate_group_tables: true
      @group = create :group, age_group: age_group
      @team1 = create :team, group: @group, name: 'Team 1'
      @team2 = create :team, group: @group, name: 'Team 2'
      @team3 = create :team, group: @group, name: 'Team 3'
      create :group_stage_match, group: @group, home_team: @team1, away_team: @team2, start_time: '10:00'
      create :group_stage_match, group: @group, home_team: @team2, away_team: @team3, start_time: '10:10'
      create :group_stage_match, group: @group, home_team: @team3, away_team: @team1, start_time: '10:20'
      create :playoff_match, age_group: @group.age_group, home_team_origin: @group, away_team_origin: @group,
             home_team_origin_rule: 1, away_team_origin_rule: 2, title: 'Final'
      visit "/official/#{@group.tournament.access_key}"
    end

    it 'stores result and updates group tables' do
      fill_result 0, 4, 6
      expect_result 0, '4 - 6'
      expect_group_table_row 0, @team2.name, 1, 1, 0, 0, 6, 4, 3
      expect_group_table_row 1, @team3.name
      expect_group_table_row 2, @team1.name, 1, 0, 0, 1, 4, 6, 0
    end

    describe 'last match result' do
      before do
        fill_result 0, 4, 6
        expect_result 0, '4 - 6'
        fill_result 1, 2, 2
        expect_result 1, '2 - 2'
        fill_result 2, 3, 0
        expect_result 2, '3 - 0'
      end

      it 'sets playoff match teams and makes it possible to save result for it' do
        expect(page.all('.match .match__teams')[3].text).to eql "Final:#{@team3.name}-#{@team2.name}"
        fill_result 3, 1, 0, true
        expect_result 3, '1 - 0 rp'
      end
    end
  end
end
