class CreateTournaments < ActiveRecord::Migration[5.2]
  def change
    create_table :tournaments do |t|
      t.string :name, null: false
      t.date :start_date, null: false
      t.integer :days, null: false, default: 1
      t.string :location, null: false

      t.timestamps
    end
  end
end
