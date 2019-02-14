json.(@tournament, :id, :name, :start_date, :end_date, :location)

json.group_stage_matches @tournament.group_stage_matches do |group_stage_match|
  json.(group_stage_match, :id, :age_group_id, :group_id, :field_id, :start_time, :home_goals, :away_goals)

  json.age_group group_stage_match.age_group, :name
  json.group group_stage_match.group, :name
  json.field group_stage_match.field, :name
  json.home_team group_stage_match.home_team, :id, :name, :club_id
  json.away_team group_stage_match.away_team, :id, :name, :club_id
end

json.age_groups @tournament.age_groups, :id, :name
json.groups @tournament.groups do |group|
  json.(group, :id, :name, :age_group_id)
  # update Api::V1::Official::GroupStageMatchesController if more fields are added
  json.results group.results, :team_name, :team_id, :club_id, :matches, :wins, :draws, :losses, :goals_for, :goals_against, :points
  json.teams group.teams do |team|
    json.(team, :id, :club_id)
  end
end
json.teams @tournament.teams, :id, :name, :club_id
json.clubs @tournament.clubs, :id, :name
json.fields @tournament.fields, :id, :name
