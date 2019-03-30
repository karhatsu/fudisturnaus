json.(@tournament, :id, :name, :start_date, :end_date, :days, :location, :address, :match_minutes, :access_key)

json.age_groups @tournament.age_groups, :id, :name, :calculate_group_tables

json.clubs @clubs, :id, :name

json.groups @tournament.groups, :id, :name, :age_group_id, :age_group_name

json.group_stage_matches @tournament.group_stage_matches do |match|
  json.(match, :id, :start_time)
  json.away_team match.away_team, :id, :name
  json.field match.field, :id, :name
  json.home_team match.home_team, :id, :name
  json.group match.group, :id, :name, :age_group_name
end

json.playoff_matches @tournament.playoff_matches do |match|
  json.(match, :id, :start_time, :title, :age_group_id)
  json.(match, :home_team_origin_id, :home_team_origin_type, :home_team_origin_rule)
  json.(match, :away_team_origin_id, :away_team_origin_type, :away_team_origin_rule)
  json.field match.field, :id, :name
end

json.fields @tournament.fields, :id, :name

json.teams @tournament.teams do |team|
  json.(team, :id, :name)
  json.club team.club, :id, :name
  json.group team.group, :id, :name, :age_group_name
end
