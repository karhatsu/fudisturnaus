require 'rails_helper'

describe 'official', type: :system do
  before do
    driven_by :selenium, using: :headless_chrome
    @tournament = create :tournament
  end

  it 'allow access to official page only with correct access key' do
    visit '/official/unknown-key'
    expect(page).to have_current_path '/'
    visit "/official/#{@tournament.access_key}"
    expect(page).to have_current_path "/official/#{@tournament.access_key}"
    expect(page.find('.title .title__text').text).to eql @tournament.name
  end
end
