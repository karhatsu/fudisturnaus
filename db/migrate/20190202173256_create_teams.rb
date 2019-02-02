class CreateTeams < ActiveRecord::Migration[5.2]
  def change
    create_table :teams do |t|
      t.references :club, foreign_key: true, null: false
      t.references :group, foreign_key: true, null: false
      t.string :name, null: false
      t.integer :group_stage_number

      t.timestamps
    end
  end
end
