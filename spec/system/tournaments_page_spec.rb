require 'rails_helper'

describe 'tournaments page', type: :system do
  before do
    driven_by :selenium, using: :headless_chrome
    create :tournament, name: 'Autumn tournament 1', start_date: '2031-10-15'
    create :tournament, name: 'Football event', start_date: '2031-10-16'
    create :tournament, name: 'Autumn tournament 2', start_date: '2031-10-17'
    create :tournament, name: 'Winter tournament', start_date: '2032-01-10'
  end

  it 'lists all tournaments when no query params' do
    visit '/tournaments'
    expect_tournaments ['Autumn tournament 1', 'Football event', 'Autumn tournament 2', 'Winter tournament']
  end

  it 'filters tournaments by name' do
    visit '/tournaments?name=autumn tou'
    expect_tournaments ['Autumn tournament 1', 'Autumn tournament 2']
  end

  it 'filters tournaments by dates and name' do
    visit '/tournaments?name=tournament&since=2031-10-18&until=2032-01-10'
    expect_tournaments ['Winter tournament']
  end

  it 'filters tournaments by dates' do
    visit '/tournaments?since=2031-10-16&until=2032-01-09'
    expect_tournaments ['Football event', 'Autumn tournament 2']
  end

  def expect_tournaments(names)
    expect(page).to have_selector('.tournament-link', count: names.length)
    names.each_with_index do |name, i|
      locator = "(//div[@class='tournament-link__tournament-name'])[#{i + 1}]"
      expect(page.find(:xpath, locator)).to have_text(name)
    end
  end
end
