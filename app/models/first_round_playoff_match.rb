class FirstRoundPlayoffMatch < PlayoffMatch
  validates :home_team_origin_rule, numericality: { only_integer: true, greater_than: 0, allow_nil: false }
  validates :away_team_origin_rule, numericality: { only_integer: true, greater_than: 0, allow_nil: false }
end
