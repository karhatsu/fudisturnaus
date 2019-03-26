def expect_result(result)
  expect(page.find('.match .match__result').text).to eql result
end

def expect_group_table_row(index, team_name, matches = 0, wins = 0, draws = 0, losses = 0, goals_for = 0, goals_against = 0, points = 0)
  rows = page.all('.group-results__group tbody tr')
  cols = rows[index].all 'td'
  expect(cols[0].text).to eql team_name
  expect(cols[1].text.to_i).to eql matches
  expect(cols[2].text.to_i).to eql wins
  expect(cols[3].text.to_i).to eql draws
  expect(cols[4].text.to_i).to eql losses
  expect(cols[5].text).to eql "#{goals_for}-#{goals_against}"
  expect(cols[6].text.to_i).to eql points
end
