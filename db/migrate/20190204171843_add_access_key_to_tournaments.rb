class AddAccessKeyToTournaments < ActiveRecord::Migration[5.2]
  def change
    add_column :tournaments, :access_key, :string
  end
end
