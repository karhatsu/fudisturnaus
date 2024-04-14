class CreateContacts < ActiveRecord::Migration[7.1]
  def change
    create_table :contacts do |t|
      t.string :person_name, null: false
      t.string :email, null: false
      t.text :message
      t.string :tournament_club
      t.string :tournament_name
      t.date :tournament_start_date
      t.integer :tournament_days
      t.string :tournament_location
      t.datetime :handled_at

      t.timestamps
    end
  end
end
