class AddPremiumToTournaments < ActiveRecord::Migration[8.1]
  def change
    add_column :tournaments, :premium, :boolean
  end
end
