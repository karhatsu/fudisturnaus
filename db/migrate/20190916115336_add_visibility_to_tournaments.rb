class AddVisibilityToTournaments < ActiveRecord::Migration[5.2]
  def change
    add_column :tournaments, :visibility, :integer, null: false, default: 2
  end
end
