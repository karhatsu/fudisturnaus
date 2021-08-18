class PlayoffGroup < ApplicationRecord
  include GroupResults

  belongs_to :age_group, touch: true
  has_many :playoff_matches

  validates :name, presence: true

  delegate :equal_points_rule, to: :age_group

  def results
    home_teams = playoff_matches.map(&:home_team)
    away_teams = playoff_matches.map(&:away_team)
    teams = (home_teams + away_teams).uniq.select {|t| t}
    calculate_group_results teams, true
  end
end
