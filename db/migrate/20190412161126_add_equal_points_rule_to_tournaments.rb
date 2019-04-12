class AddEqualPointsRuleToTournaments < ActiveRecord::Migration[5.2]
  def change
    add_column :tournaments, :equal_points_rule, :integer, null: false, default: Tournament::EQUAL_POINTS_RULE_ALL_MATCHES_FIRST
  end
end
