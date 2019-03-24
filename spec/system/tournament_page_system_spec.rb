require 'rails_helper'

describe 'tournament page', type: :system do
  let(:name) { 'Test tournament' }
  let(:location) { 'Test pitch' }
  let(:address) { 'Test street 24 B 00940 Test city' }
  let(:start_date) { '2019-06-01' }
  let(:formatted_date) { '01.06.2019' }

  before do
    driven_by :selenium, using: :headless_chrome
    @tournament = create :tournament, name: name, location: location, address: address, start_date: start_date
  end

  it 'shows basic tournament info' do
    visit '/'
    expect(page.find('.tournament-link__tournament-name').text).to eql name
    expect(page.find('.tournament-link__other-info').text).to eql "#{location}, #{formatted_date}"
    click_link name
    expect(page).to have_current_path("/tournaments/#{@tournament.id}")
    expect(page.find('.title__text').text).to eql name
    expect(page.find('.sub-title').text).to eql "#{location}, #{formatted_date}"
    expect(page.find('.sub-title a').text).to eql location
    expect(page.find('.sub-title a')[:href]).to eql "https://www.google.com/maps/place/#{address.gsub(' ', '+')}"
  end
end
