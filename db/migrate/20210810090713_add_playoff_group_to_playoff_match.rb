class AddPlayoffGroupToPlayoffMatch < ActiveRecord::Migration[6.1]
  def change
    add_reference :playoff_matches, :playoff_group, null: true, foreign_key: true
  end
end
