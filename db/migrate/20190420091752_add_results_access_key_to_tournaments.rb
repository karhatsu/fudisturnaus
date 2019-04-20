class AddResultsAccessKeyToTournaments < ActiveRecord::Migration[5.2]
  def change
    add_column :tournaments, :results_access_key, :string
    Tournament.all.each do |t|
      t.update_attribute :results_access_key, SecureRandom.hex
    end
  end
end
