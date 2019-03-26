def expect_result(result)
  expect(page.find('.match .match__result').text).to eql result
end
