class CreatePlayoffGroups < ActiveRecord::Migration[6.1]
  def change
    create_table :playoff_groups do |t|
      t.references :age_group, null: false, foreign_key: true
      t.string :name, null: false

      t.timestamps
    end
  end
end
