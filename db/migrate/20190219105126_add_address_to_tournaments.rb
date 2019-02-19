class AddAddressToTournaments < ActiveRecord::Migration[5.2]
  def change
    add_column :tournaments, :address, :string
  end
end
