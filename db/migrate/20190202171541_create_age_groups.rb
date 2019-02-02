class CreateAgeGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :age_groups do |t|
      t.references :tournament, foreign_key: true, null: false
      t.string :name, null: false

      t.timestamps
    end
  end
end
