class AddRefereeIdToMatches < ActiveRecord::Migration[7.0]
  def change
    add_reference :group_stage_matches, :referee, null: true, foreign_key: true
    add_reference :playoff_matches, :referee, null: true, foreign_key: true
  end
end
