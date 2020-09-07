class AddCancelledToTournaments < ActiveRecord::Migration[5.2]
  def change
    add_column :tournaments, :cancelled, :boolean, null: false, default: false
  end
end
