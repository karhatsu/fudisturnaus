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
      expect(page).to have_xpath("(//span[contains(@class, 'title__text')])[text()='#{tournament.name}']")
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
      form_inputs[1].check
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

      add_new_item 'teams'
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

      add_new_item 'playoff-matches'
      form_selects[0].select 'T11'
      form_selects[1].select 'Field 1'
      form_inputs[0].fill_in with: '13:00'
      form_inputs[1].fill_in with: 'Finaali'
      form_selects[2].select 'Group A'
      form_selects[3].select '1.'
      form_selects[4].select 'Group A'
      form_selects[5].select '1.'
      submit
      expect_item_title 'playoff-matches', 'Field 1 | 13:00 | T11 | Finaali'

      add_new_item 'playoff-matches'
      form_selects[0].select 'T11'
      form_selects[1].select 'Field 1'
      form_inputs[1].fill_in with: 'Superfinaali'
      form_selects[2].select 'Finaali'
      form_selects[3].select 'Voittaja'
      form_selects[4].select 'Finaali'
      form_selects[5].select 'Häviäjä'
      submit
      expect_item_title 'playoff-matches', 'Field 1 | 13:45 | T11 | Superfinaali', 1

      click_link 'Takaisin tulosten syöttöön'
      expect_match_info_for_added_match
      expect_playoff_match_info '13:00', 'Field 1', 'T11', 'Finaali', 1
      expect_playoff_match_info '13:45', 'Field 1', 'T11', 'Superfinaali', 2

      visit "/tournaments/#{@tournament.id}"
      expect_match_info_for_added_match
      expect_playoff_match_info '13:00', 'Field 1', 'T11', 'Finaali', 1
      expect_playoff_match_info '13:45', 'Field 1', 'T11', 'Superfinaali', 2
    end

    def expect_match_info_for_added_match
      expect_match_info '11:30', 'Field 1', 'T11', 'Group A', 'FC Brown', 'SC Lions Green'
    end
  end

  describe 'tournament editing' do
    let(:start_date) { '2019-05-18' } # Sat = la
    before do
      club = create :club
      tournament = create :tournament, start_date: start_date
      age_group = create :age_group, tournament: tournament, calculate_group_tables: true, name: 'P10'
      group = create :group, age_group: age_group, name: 'A'
      team1 = create :team, group: group, name: 'Team 1', club: club
      team2 = create :team, group: group, name: 'Team 2', club: club
      field = create :field, name: 'Field', tournament: tournament
      create :group_stage_match, group: group, home_team: team1, away_team: team2,
             start_time: "#{start_date}T#10:00+03:00", field: field
      create :playoff_match, age_group: age_group, home_team_origin: group, away_team_origin: group,
             home_team_origin_rule: 1, away_team_origin_rule: 2, title: 'Final', field: field,
             start_time: "#{start_date}T12:00+03:00"
      visit "/official/#{tournament.access_key}/management"
    end

    it 'works' do
      edit_item 'tournament', 0
      form_inputs[0].fill_in with: 'New name'
      form_inputs[1].fill_in with: '25/05/2019' # still Sat
      form_inputs[2].fill_in with: '2'
      form_inputs[3].fill_in with: 'Test city'
      form_inputs[4].fill_in with: 'Street 10'
      form_inputs[5].fill_in with: '60'
      submit
      expect_item_title 'tournament', 'New name, 25.05.2019 - 26.05.2019, Test city, Street 10'

      edit_item 'fields', 0
      form_inputs[0].fill_in with: 'Grass'
      submit
      expect_item_title 'fields', 'Grass'
      expect_item_title 'group-stage-matches', 'Grass | la 10:00 | A (P10) | Team 1 - Team 2'
      expect_item_title 'playoff-matches', 'Grass | la 12:00 | P10 | Final'

      edit_item 'age-groups', 0
      form_inputs[0].fill_in with: 'T08'
      submit
      expect_item_title 'age-groups', 'T08'
      expect_item_title 'groups', 'A (T08)'
      expect_section_title 'teams', 'A (T08)'
      expect_item_title 'group-stage-matches', 'Grass | la 10:00 | A (T08) | Team 1 - Team 2'
      expect_item_title 'playoff-matches', 'Grass | la 12:00 | T08 | Final'

      edit_item 'groups', 0
      form_inputs[0].fill_in with: 'B'
      submit
      expect_item_title 'groups', 'B (T08)'
      expect_section_title 'teams', 'B (T08)'
      expect_item_title 'group-stage-matches', 'Grass | la 10:00 | B (T08) | Team 1 - Team 2'

      edit_item 'teams', 0
      form_inputs[0].fill_in with: 'FC Team'
      submit
      expect_item_title 'teams', 'FC Team'
      expect_item_title 'group-stage-matches', 'Grass | la 10:00 | B (T08) | FC Team - Team 2'

      edit_item 'group-stage-matches', 0
      form_selects[1].select 'su'
      form_inputs[0].fill_in with: '11:00'
      form_selects[3].select 'Team 2'
      form_selects[4].select 'FC Team'
      submit
      expect_item_title 'group-stage-matches', 'Grass | su 11:00 | B (T08) | Team 2 - FC Team'

      edit_item 'playoff-matches', 0
      form_selects[2].select 'su'
      form_inputs[0].fill_in with: '13:00'
      form_inputs[1].fill_in with: 'Grande Finale'
      submit
      expect_item_title 'playoff-matches', 'Grass | su 13:00 | T08 | Grande Finale'
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
      expect_group_table_row 0, 1, @team2.name, 1, 1, 0, 0, 6, 4, 3
      expect_group_table_row 1, 2, @team3.name
      expect_group_table_row 2, 3, @team1.name, 1, 0, 0, 1, 4, 6, 0
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

  describe 'multiple days tournament' do
    before do
      tournament = create :tournament, start_date: '2019-06-05', days: 3 # Wed-Fri
      age_group = create :age_group, tournament: tournament, name: 'P11'
      group = create :group, age_group: age_group, name: 'Group B'
      create :team, group: group, name: 'Team 1'
      create :team, group: group, name: 'Team 2'
      create :field, tournament: tournament, name: 'Field 1'
      visit "/official/#{tournament.access_key}/management"
    end

    it 'provides days menu in form and shows weekday on match info' do
      add_new_item 'group-stage-matches'
      form_selects[0].select 'Field 1'
      form_selects[1].select 'to' # Thursday
      form_inputs[0].fill_in with: '14:45'
      form_selects[2].select 'Group B (P11)'
      form_selects[3].select 'Team 1'
      form_selects[4].select 'Team 2'
      submit
      expect_item_title 'group-stage-matches', 'Field 1 | to 14:45 | Group B (P11) | Team 1 - Team 2'
      edit_item 'group-stage-matches', 0
      form_selects[1].select 'pe' # Friday
      form_inputs[0].fill_in with: '12:00'
      submit
      expect_item_title 'group-stage-matches', 'Field 1 | pe 12:00 | Group B (P11) | Team 1 - Team 2'
      click_link 'Takaisin tulosten syöttöön'
      expect_match_info 'pe 12:00', 'Field 1', 'P11', 'Group B', 'Team 1', 'Team 2'
    end
  end

  def edit_item(section_name, index)
    page.all(".tournament-management__section--#{section_name} .tournament-item__title--existing span")[index].click
  end

  def add_new_item(section_name)
    page.find(".tournament-management__section--#{section_name} .tournament-item__title--new span").click
  end

  def form_inputs
    page.all('.form__field input')
  end

  def form_selects
    page.all('.form__field select')
  end

  def submit
    page.find('form .button--primary').click
  end

  def expect_item_title(section_name, title, index = 0)
    expect(page).not_to have_css('.form')
    expect(page.all(".tournament-management__section--#{section_name} .tournament-item__title")[index].text).to eql title
  end

  def expect_section_title(section_name, title, index = 0)
    expect(page.all(".tournament-management__section--#{section_name} .tournament-management__section-title")[index].text).to eql title
  end
end
