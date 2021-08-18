class PlayoffGroup < ApplicationRecord
  include GroupResults

  belongs_to :age_group, touch: true
  has_many :playoff_matches

  validates :name, presence: true

  delegate :equal_points_rule, to: :age_group

  def results
    calculate_group_results teams, true
  end

  def teams
    home_teams = playoff_matches.map(&:home_team)
    away_teams = playoff_matches.map(&:away_team)
    (home_teams + away_teams).uniq.select {|t| t}
  end
end
