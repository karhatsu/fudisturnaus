class CreateReferees < ActiveRecord::Migration[7.0]
  def change
    create_table :referees do |t|
      t.references :tournament, null: false, foreign_key: true
      t.string :name, null: false
      t.string :access_key, null: false

      t.timestamps
    end
  end
end
