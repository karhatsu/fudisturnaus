class Group < ApplicationRecord
  belongs_to :age_group
  has_many :teams
  has_many :group_stage_matches

  validates :name, presence: true

  def results
    teams.map(&:group_results).sort do |a, b|
      [b.points, b.goals_difference, b.goals_for, a.team_name] <=> [a.points, a.goals_difference, a.goals_for, b.team_name]
    end
  end
end
