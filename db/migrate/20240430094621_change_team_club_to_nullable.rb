
class ChangeTeamClubToNullable < ActiveRecord::Migration[7.1]
  NAME = '- Ei virallista seuraa -'

  def up
    change_column_null :teams, :club_id, true
    execute "UPDATE teams SET club_id = NULL WHERE club_id = (SELECT id FROM clubs WHERE name = '#{NAME}')"
    Club.where(name: NAME).destroy_all
  end

  def down
    Club.create! name: NAME
    execute "UPDATE teams SET club_id = (SELECT id FROM clubs WHERE name = '#{NAME}') WHERE club_id IS NULL"
    change_column_null :teams, :club_id, false
  end
end
