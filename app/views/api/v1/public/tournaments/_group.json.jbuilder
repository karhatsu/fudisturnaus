json.(group, :id, :name, :age_group_id)
json.age_group group.age_group, :name
# update Api::V1::Official::GroupStageResultsController if more fields are added
json.results group.results, :ranking, :team_name, :team_id, :club_id, :matches, :wins, :draws, :losses, :goals_for, :goals_against, :points, :lot
