json.(@tournament, :id, :name, :start_date, :end_date, :days, :location, :address, :calculate_group_tables, :visibility, :cancelled, :slug)
json.club @tournament.club, :logo_url if @tournament.club_id

json.group_stage_matches @tournament.group_stage_matches do |group_stage_match|
  json.(group_stage_match, :id, :age_group_id, :group_id, :field_id, :start_time, :day, :home_goals, :away_goals)
  json.type 'GroupStageMatch'

  json.age_group group_stage_match.age_group, :name
  json.group group_stage_match.group, :name
  json.field group_stage_match.field, :name
  json.home_team group_stage_match.home_team, :id, :name, :club_id
  json.away_team group_stage_match.away_team, :id, :name, :club_id
end

json.playoff_matches @tournament.playoff_matches do |playoff_match|
  json.(playoff_match, :id, :age_group_id, :field_id, :title, :start_time, :day, :home_goals, :away_goals, :penalties, :home_team_origin_id, :away_team_origin_id)
  json.type 'PlayoffMatch'

  json.age_group playoff_match.age_group, :name
  json.field playoff_match.field, :name
  if playoff_match.home_team
    json.home_team playoff_match.home_team, :id, :name, :club_id
  end
  if playoff_match.away_team
    json.away_team playoff_match.away_team, :id, :name, :club_id
  end
end

json.age_groups @tournament.age_groups, :id, :name
json.groups @tournament.groups do |group|
  json.partial! 'group', group: group
end
json.playoff_groups @tournament.playoff_groups do |playoff_group|
  json.partial! 'group', group: playoff_group
end
json.teams @tournament.teams, :id, :name, :club_id, :group_id, :age_group_id
json.clubs @tournament.clubs, :id, :name, :logo_url
json.fields @tournament.fields, :id, :name
