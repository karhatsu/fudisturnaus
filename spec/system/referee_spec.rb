require 'rails_helper'

describe 'referee', type: :system do
  before do
    driven_by :selenium, using: :headless_chrome
  end

  describe 'access' do
    it 'allow access to referee page only with correct access key' do
      tournament = create :tournament
      referee = create :referee, tournament: tournament
      visit "/referees/#{tournament.access_key}"
      expect(page).to have_current_path '/'
      visit "/referees/#{referee.access_key}"
      expect(page).to have_current_path "/referees/#{referee.access_key}"
      expect(page).to have_xpath("(//span[contains(@class, 'title__text')])[text()='#{tournament.name}']")
    end
  end

  describe 'result saving' do
    before do
      tournament = create :tournament
      @referee = create :referee, tournament: tournament
      age_group = create :age_group, calculate_group_tables: true, tournament: tournament
      @group = create :group, age_group: age_group
      @team1 = create :team, group: @group, name: 'Team 1'
      @team2 = create :team, group: @group, name: 'Team 2'
      @team3 = create :team, group: @group, name: 'Team 3'
      create :group_stage_match, group: @group, home_team: @team1, away_team: @team2, start_time: '10:00', referee: @referee
      @match2 = create :group_stage_match, group: @group, home_team: @team2, away_team: @team3, start_time: '10:10'
      @match3 = create :group_stage_match, group: @group, home_team: @team3, away_team: @team1, start_time: '10:20'
      create :playoff_match, age_group: @group.age_group, home_team_origin: @group, away_team_origin: @group,
             home_team_origin_rule: 1, away_team_origin_rule: 2, title: 'Final', referee: @referee
      visit "/referees/#{@referee.access_key}"
    end

    it 'referee can see the matches assigned to them and save the result' do
      fill_result 0, 4, 6
      expect_result 0, '4 - 6'
      expect(page).to have_content @team1.name
      expect(page).to have_content @team2.name
      expect(page).not_to have_content @team3.name
    end

    describe 'playoff matches' do
      before do
        fill_result 0, 4, 6
        @match2.home_goals = 2
        @match2.away_goals = 2
        @match2.save!
        @match3.home_goals = 0
        @match3.away_goals = 8
        @match3.save!
      end

      it 'referee can save the playoff match result' do
        visit "/referees/#{@referee.access_key}"
        expect(page.all('.match .match__teams')[1].find('.match__playoff-title').text).to eql 'Final:'
        expect(page.all('.match .match__teams')[1].all('.team')[0].text).to eql @team2.name
        expect(page.all('.match .match__teams')[1].all('.team')[1].text).to eql @team1.name
        fill_result 1, 1, 0, true
        expect_result 1, '1 - 0 rp'
      end
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
