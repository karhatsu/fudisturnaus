require 'rails_helper'

describe 'official', type: :system do
  before do
    driven_by :selenium, using: :headless_chrome
    age_group = create :age_group, calculate_group_tables: true
    @group = create :group, age_group: age_group
  end

  it 'allow access to official page only with correct access key' do
    visit '/official/unknown-key'
    expect(page).to have_current_path '/'
    visit "/official/#{@group.tournament.access_key}"
    expect(page).to have_current_path "/official/#{@group.tournament.access_key}"
    expect(page.find('.title .title__text').text).to eql @group.tournament.name
  end

  describe 'result saving' do
    before do
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
        fill_result 1, 2, 2
        fill_result 2, 3, 0
      end

      it 'sets playoff match teams and makes it possible to save result for it' do
        expect(page.all('.match .match__teams')[3].text).to eql "Final:#{@team3.name}-#{@team2.name}"
        fill_result 3, 1, 0, true
        expect_result 3, '1 - 0 rp'
      end
    end
  end
end
