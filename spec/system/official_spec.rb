require 'rails_helper'

describe 'official', type: :system do
  before do
    driven_by :selenium, using: :headless_chrome
    @group = create :group
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
      club = create :club
      team1 = create :team, club: club, group: @group, name: 'Team 1'
      team2 = create :team, club: club, group: @group, name: 'Team 2'
      create :group_stage_match, group: @group, home_team: team1, away_team: team2
      visit "/official/#{@group.tournament.access_key}"
    end

    it 'works' do
      page.find('.match').click
      page.all('.match__goals-field')[0].fill_in with: '6'
      page.all('.match__goals-field')[1].fill_in with: '4'
      page.all('.match__button')[0].click
      expect_result '6 - 4'
    end
  end
end
