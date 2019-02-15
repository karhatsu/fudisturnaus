class CreatePlayoffMatches < ActiveRecord::Migration[5.2]
  def change
    create_table :playoff_matches do |t|
      t.references :age_group, null: false
      t.references :field, foreign_key: true, null: false
      t.references :home_team_origin, polymorphic: true, index: { name: :index_playoff_matches_on_home_team_origin }, null: false
      t.references :away_team_origin, polymorphic: true, index: { name: :index_playoff_matches_on_away_team_origin }, null: false
      t.integer :home_team_origin_rule, null: false
      t.integer :away_team_origin_rule, null: false
      t.references :home_team, foreign_key: { to_table: :teams }
      t.references :away_team, foreign_key: { to_table: :teams }
      t.datetime :start_time, null: false
      t.string :title, null: false
      t.integer :home_goals
      t.integer :away_goals
      t.boolean :penalties, null: false, default: false

      t.timestamps
    end
  end
end
