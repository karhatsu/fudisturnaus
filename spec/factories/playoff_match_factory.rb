FactoryBot.define do
  factory :playoff_match do
    age_group
    title { 'Semifinal' }
    field
    start_time { '12:00' }
    home_team_origin { group }
    away_team_origin { group }
    home_team_origin_rule { 1 }
    away_team_origin_rule { 2 }
  end
end
