class Group < ApplicationRecord
  belongs_to :age_group
  has_many :teams
  has_many :group_stage_matches
  has_many :first_round_playoff_matches_as_home_team, as: :home_team_origin
  has_many :first_round_playoff_matches_as_away_team, as: :away_team_origin

  validates :name, presence: true

  def results
    teams.map(&:group_results).sort do |a, b|
      [b.points, b.goals_difference, b.goals_for, a.team_name] <=> [a.points, a.goals_difference, a.goals_for, b.team_name]
    end
  end
end
