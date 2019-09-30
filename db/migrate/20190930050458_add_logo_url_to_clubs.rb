class AddLogoUrlToClubs < ActiveRecord::Migration[5.2]
  def change
    add_column :clubs, :logo_url, :string
  end
end
