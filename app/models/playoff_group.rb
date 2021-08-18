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
    home_teams = playoff_matches.map do |m|
      if m.home_team
        m.home_team
      elsif m.home_team_origin_rule > 0
        UnassignedPlayoffGroupTeam.new("#{m.home_team_origin.name}#{m.home_team_origin_rule}")
      end
    end
    away_teams = playoff_matches.map do |m|
      if m.away_team
        m.away_team
      elsif m.away_team_origin_rule > 0
        UnassignedPlayoffGroupTeam.new("#{m.away_team_origin.name}#{m.away_team_origin_rule}")
      end
    end
    (home_teams + away_teams).select {|t| t}.uniq {|t| t.name}
  end
end
