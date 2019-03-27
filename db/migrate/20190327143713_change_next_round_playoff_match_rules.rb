class ChangeNextRoundPlayoffMatchRules < ActiveRecord::Migration[5.2]
  def up
    execute "UPDATE playoff_matches SET home_team_origin_rule=-1 WHERE home_team_origin_type='PlayoffMatch' AND home_team_origin_rule=1"
    execute "UPDATE playoff_matches SET home_team_origin_rule=-2 WHERE home_team_origin_type='PlayoffMatch' AND home_team_origin_rule=0"
    execute "UPDATE playoff_matches SET away_team_origin_rule=-1 WHERE away_team_origin_type='PlayoffMatch' AND away_team_origin_rule=1"
    execute "UPDATE playoff_matches SET away_team_origin_rule=-2 WHERE away_team_origin_type='PlayoffMatch' AND away_team_origin_rule=0"
  end

  def down
    execute "UPDATE playoff_matches SET home_team_origin_rule=1 WHERE home_team_origin_type='PlayoffMatch' AND home_team_origin_rule=-1"
    execute "UPDATE playoff_matches SET home_team_origin_rule=0 WHERE home_team_origin_type='PlayoffMatch' AND home_team_origin_rule=-2"
    execute "UPDATE playoff_matches SET away_team_origin_rule=1 WHERE away_team_origin_type='PlayoffMatch' AND away_team_origin_rule=-1"
    execute "UPDATE playoff_matches SET away_team_origin_rule=0 WHERE away_team_origin_type='PlayoffMatch' AND away_team_origin_rule=-2"
  end
end
