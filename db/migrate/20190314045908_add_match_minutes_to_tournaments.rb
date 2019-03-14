class AddMatchMinutesToTournaments < ActiveRecord::Migration[5.2]
  def change
    add_column :tournaments, :match_minutes, :integer, null: false, default: 45
  end
end
