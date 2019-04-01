json.(@tournament, :id, :name, :start_date, :end_date, :days, :location, :address, :match_minutes, :access_key)

json.age_groups @tournament.age_groups, :id, :name, :calculate_group_tables

json.clubs @clubs, :id, :name

json.groups @tournament.groups, :id, :name, :age_group_id

json.group_stage_matches @tournament.group_stage_matches, :id, :age_group_id, :group_id, :field_id, :start_time,
                         :home_team_id, :away_team_id

json.playoff_matches @tournament.playoff_matches, :id, :start_time, :title, :age_group_id, :field_id,
                     :home_team_origin_id, :home_team_origin_type, :home_team_origin_rule,
                     :away_team_origin_id, :away_team_origin_type, :away_team_origin_rule

json.fields @tournament.fields, :id, :name

json.teams @tournament.teams do |team|
  json.(team, :id, :name, :group_id)
  json.club team.club, :id, :name
end
