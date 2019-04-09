class AddLotToTeams < ActiveRecord::Migration[5.2]
  def change
    add_column :teams, :lot, :integer
  end
end
