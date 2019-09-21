def fill_result(match_index, home_goals, away_goals, penalties = false)
  page.all('.match')[match_index].click
  page.all('.match__goals-field')[0].fill_in with: home_goals
  page.all('.match__goals-field')[1].fill_in with: away_goals
  if penalties
    page.find('.match__penalties input').check
  end
  page.all('.match__button')[0].click
end

def expect_match_info(start_time, field_name, age_group_name, group_name, home_team_name, away_team_name, index = 0)
  expect(page.all('.match .match__start-time')[index].text).to eql "#{start_time}"
  expect(page.all('.match .match__details')[index].text).to eql "#{field_name}, #{age_group_name}, #{group_name}"
  expect(page.all('.match .match__teams')[index].text).to eql "#{home_team_name}-#{away_team_name}"
end

def expect_playoff_match_info(start_time, field_name, age_group_name, title, index = 0)
  expect(page.all('.match .match__start-time')[index].text).to eql "#{start_time}"
  expect(page.all('.match .match__details')[index].text).to eql "#{field_name}, #{age_group_name}"
  expect(page.all('.match .match__teams')[index].text).to eql "#{title}"
end

def expect_result(match_index, result)
  expect(page).to have_xpath("(//div[contains(@class, 'match__result')])[#{match_index + 1}]/span[normalize-space()='#{result}']")
end

def expect_group_table_row(index, ranking, team_name, matches = 0, wins = 0, draws = 0, losses = 0, goals_for = 0, goals_against = 0, points = 0)
  rows = page.all('.group-results__group tbody tr')
  cols = rows[index].all 'td'
  expect(cols[0].text).to eql(ranking ? "#{ranking}." : '')
  expect(cols[1].text).to eql team_name
  expect(cols[2].text.to_i).to eql matches
  expect(cols[3].text.to_i).to eql wins
  expect(cols[4].text.to_i).to eql draws
  expect(cols[5].text.to_i).to eql losses
  expect(cols[6].text).to eql "#{goals_for}-#{goals_against}"
  expect(cols[7].text.to_i).to eql points
end

def expect_message(type, text)
  expect(page.find("div.message.message--#{type}").text).to eql text
end

def expect_no_message(type)
  expect(page).to have_no_xpath("//div[contains(@class, 'message--#{type}')]")
end
