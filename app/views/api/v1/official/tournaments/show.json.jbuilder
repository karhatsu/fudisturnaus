json.partial! 'tournament', tournament: @tournament

json.age_groups @tournament.age_groups, partial: 'api/v1/official/age_groups/age_group', as: :age_group

json.clubs @clubs, partial: 'api/v1/official/clubs/club', as: :club

json.groups @tournament.groups do |group|
  json.partial! 'api/v1/official/groups/group', group: group
  if group.group_stage_matches.length > 0 && group.results_in_all_matches? && group.has_equal_rankings? || group.lottery_done?
    json.results group.results, :ranking, :team_name, :team_id, :lot
  end
end

json.group_stage_matches @tournament.group_stage_matches, partial: 'api/v1/official/group_stage_matches/group_stage_match', as: :group_stage_match

json.playoff_groups @tournament.playoff_groups do |group|
  json.partial! 'api/v1/official/groups/group', group: group
end

json.playoff_matches @tournament.playoff_matches, partial: 'api/v1/official/playoff_matches/playoff_match', as: :playoff_match

json.fields @tournament.fields, partial: 'api/v1/official/fields/field', as: :field

json.teams @tournament.teams, partial: 'api/v1/official/teams/team', as: :team

json.referees @tournament.referees, partial: 'api/v1/official/referees/referee', as: :referee
