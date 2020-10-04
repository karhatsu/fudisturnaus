class AddClubIdToTournaments < ActiveRecord::Migration[6.0]
  def change
    add_reference :tournaments, :club, null: true, foreign_key: true
  end
end
