class AddInfoToTournaments < ActiveRecord::Migration[7.0]
  def change
    add_column :tournaments, :info, :text
  end
end
