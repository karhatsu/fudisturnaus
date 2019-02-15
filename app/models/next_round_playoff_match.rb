class NextRoundPlayoffMatch < PlayoffMatch
  RULE_LOSER = 0
  RULE_WINNER = 1

  validates :home_team_origin_rule, inclusion: { in: [RULE_LOSER, RULE_WINNER] }
  validates :away_team_origin_rule, inclusion: { in: [RULE_LOSER, RULE_WINNER] }
end
