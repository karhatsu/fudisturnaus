require 'rails_helper'

describe 'tournament visibilities', type: :system do
  before do
    driven_by :selenium, using: :headless_chrome
  end

  describe 'only title' do
    let(:tournament) { create :tournament, visibility: Tournament::VISIBILITY_ONLY_TITLE }

    it 'public page shows message about unpublished matches' do
      visit "/tournaments/#{tournament.id}"
      expect_message 'warning', 'Turnauksen osallistujia ja otteluohjelmaa ei ole vielä julkaistu'
    end

    it 'results official page shows message about result saving' do
      visit "/results/#{tournament.results_access_key}"
      expect_message 'warning', 'Kun turnauksen otteluohjelma julkaistaan, pääset tällä sivulla tallentamaan otteluiden tuloksia.'
    end

    it 'full official page shows message about result saving' do
      visit "/official/#{tournament.access_key}"
      expect_message 'warning', 'Kun olet julkaissut turnauksen otteluohjelman, pääset tässä tallentamaan otteluiden tuloksia.'
      click_link 'Muokkaa turnauksen asetuksia ja otteluohjelmaa'
      expect(page).to have_text('Perustiedot')
    end
  end

  describe 'teams' do
    let(:tournament) { create :tournament, visibility: Tournament::VISIBILITY_TEAMS }

    it 'public page shows message about unpublished matches' do
      visit "/tournaments/#{tournament.id}"
      expect_message 'warning', 'Turnauksen otteluohjelma julkaistaan myöhemmin'
    end

    it 'results official page shows message about result saving' do
      visit "/results/#{tournament.results_access_key}"
      expect_message 'warning', 'Kun turnauksen otteluohjelma julkaistaan, pääset tällä sivulla tallentamaan otteluiden tuloksia.'
    end

    it 'full official page shows message about result saving' do
      visit "/official/#{tournament.access_key}"
      expect_message 'warning', 'Kun olet julkaissut turnauksen otteluohjelman, pääset tässä tallentamaan otteluiden tuloksia.'
      click_link 'Muokkaa turnauksen asetuksia ja otteluohjelmaa'
      expect(page).to have_text('Perustiedot')
    end

    context 'with some teams added' do
      before do
        age_group = create :age_group, tournament: tournament, name: 'P11'
        group = create :group, age_group: age_group
        create :team, group: group, name: 'FC Team 1'
        create :team, group: group, name: 'SC Team 1'
      end

      it 'public page shows teams' do
        visit "/tournaments/#{tournament.id}"
        expect(page.find('.series-and-teams .title-2')).to have_text('Ilmoittautuneet joukkueet')
        expect(page.all('.series-and-teams__team')[0]).to have_text('FC Team 1')
        expect(page.all('.series-and-teams__team')[1]).to have_text('SC Team 1')
      end

      context 'in two age groups' do
        before do
          age_group = create :age_group, tournament: tournament, name: 'P12'
          group = create :group, age_group: age_group
          create :team, group: group, name: 'FC Team 2'
          create :team, group: group, name: 'SC Team 2'
        end

        it 'public page shows teams in both age groups' do
          visit "/tournaments/#{tournament.id}"
          expect(page.all('.series-and-teams .title-2')[0]).to have_text('P11')
          expect(page.all('.series-and-teams .title-2')[1]).to have_text('P12')
          expect(page.all('.series-and-teams__age-group')[1].all('.series-and-teams__team')[0]).to have_text('FC Team 2')
          expect(page.all('.series-and-teams__age-group')[1].all('.series-and-teams__team')[1]).to have_text('SC Team 2')
        end
      end
    end
  end

  describe 'everything' do
    let(:tournament) { create :tournament, visibility: Tournament::VISIBILITY_ALL, start_date: '2019-10-01' }

    it 'public page shows message about unpublished matches' do
      visit "/tournaments/#{tournament.id}"
      expect_message 'warning', 'Turnauksen otteluohjelma julkaistaan myöhemmin'
    end

    it 'results official page shows message about result saving' do
      visit "/results/#{tournament.results_access_key}"
      expect_message 'warning', 'Kun turnauksen otteluohjelma julkaistaan, pääset tällä sivulla tallentamaan otteluiden tuloksia.'
    end

    it 'full official page shows message about result saving' do
      visit "/official/#{tournament.access_key}"
      expect_message 'warning', 'Kun olet julkaissut turnauksen otteluohjelman, pääset tässä tallentamaan otteluiden tuloksia.'
      click_link 'Muokkaa turnauksen asetuksia ja otteluohjelmaa'
      expect(page).to have_text('Perustiedot')
    end

    context 'with matches added' do
      before do
        field = create :field, tournament: tournament, name: 'The field'
        age_group = create :age_group, tournament: tournament, name: 'P11'
        group = create :group, age_group: age_group, name: 'A'
        team1 = create :team, group: group, name: 'FC Team 1'
        team2 = create :team, group: group, name: 'SC Team 1'
        create :group_stage_match, group: group, home_team: team1, away_team: team2, start_time: '2019-10-01T12:00:00+03:00', field: field
      end

      it 'public page shows matches' do
        visit "/tournaments/#{tournament.id}"
        expect_match
        expect_no_message 'warning'
      end

      it 'results official page shows matches' do
        visit "/results/#{tournament.results_access_key}"
        expect_match
        expect_no_message 'warning'
      end

      it 'full official page shows matches and link to settings' do
        visit "/official/#{tournament.access_key}"
        expect_match
        expect_no_message 'warning'
        click_link 'Muokkaa turnauksen asetuksia ja otteluohjelmaa'
        expect(page).to have_text('Perustiedot')
      end

      def expect_match
        expect_match_info '12:00', 'P11', 'A', 'FC Team 1', 'SC Team 1'
      end
    end
  end
end
