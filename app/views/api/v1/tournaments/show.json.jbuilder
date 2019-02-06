json.(@tournament, :id, :name, :start_date, :end_date, :location)

json.group_stage_matches @tournament.group_stage_matches do |group_stage_match|
  json.(group_stage_match, :id, :group_id, :start_time, :home_goals, :away_goals)

  json.field group_stage_match.field, :name
  json.home_team group_stage_match.home_team, :name
  json.away_team group_stage_match.away_team, :name
end

json.groups @tournament.groups, :id, :name
