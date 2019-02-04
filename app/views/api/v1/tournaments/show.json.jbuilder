json.(@tournament, :id, :name, :start_date, :end_date, :location)

json.age_groups @tournament.age_groups do |age_group|
  json.(age_group, :name)

  json.groups age_group.groups do |group|
    json.(group, :name)

    json.group_stage_matches group.group_stage_matches do |group_stage_match|
      json.(group_stage_match, :id, :start_time, :home_goals, :away_goals)

      json.field group_stage_match.field, :name
      json.home_team group_stage_match.home_team, :name
      json.away_team group_stage_match.away_team, :name
    end
  end
end
