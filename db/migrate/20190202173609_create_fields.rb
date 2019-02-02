class CreateFields < ActiveRecord::Migration[5.2]
  def change
    create_table :fields do |t|
      t.references :tournament, foreign_key: true, null: false
      t.string :name, null: false

      t.timestamps
    end
  end
end
