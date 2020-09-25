class AddTestToTournaments < ActiveRecord::Migration[6.0]
  def change
    add_column :tournaments, :test, :boolean, null: false, default: false
  end
end
