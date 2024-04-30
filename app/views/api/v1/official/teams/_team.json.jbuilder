json.(team, :id, :name, :age_group_id, :group_id)
if team.club
  json.club team.club, :id, :name
end
