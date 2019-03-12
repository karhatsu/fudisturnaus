json.(@group_stage_match, :id, :age_group_id, :group_id, :field_id, :start_time)
json.group @group_stage_match.group, :id, :name, :age_group_name
json.field @group_stage_match.field, :id, :name
json.home_team @group_stage_match.home_team, :id, :name, :club_id
json.away_team @group_stage_match.away_team, :id, :name, :club_id
