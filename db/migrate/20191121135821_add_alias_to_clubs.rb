class AddAliasToClubs < ActiveRecord::Migration[5.2]
  def change
    add_column :clubs, :alias, :string
  end
end
