class CreateGroupStageMatches < ActiveRecord::Migration[5.2]
  def change
    create_table :group_stage_matches do |t|
      t.references :group, foreign_key: true, null: false
      t.references :field, foreign_key: true, null: false
      t.datetime :start_time, null: false
      t.references :home_team, foreign_key: { to_table: :teams }, null: false
      t.references :away_team, foreign_key: { to_table: :teams }, null: false
      t.integer :home_goals
      t.integer :away_goals

      t.timestamps
    end
  end
end
