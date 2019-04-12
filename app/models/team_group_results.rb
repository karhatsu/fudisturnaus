class TeamGroupResults
  attr_reader :matches, :wins, :draws, :losses, :goals_for, :goals_against, :points, :team
  attr_accessor :ranking, :relative_points, :mutual_relative_points

  def initialize(team, teams = nil)
    @matches = 0
    @wins = 0
    @draws = 0
    @losses = 0
    @goals_for = 0
    @goals_against = 0
    @points = 0
    @team = team
    team.group_stage_home_matches.select{|match| use_match?(match, teams)}.each do |match|
      handle_match match.home_goals, match.away_goals
    end
    team.group_stage_away_matches.select{|match| use_match?(match, teams)}.each do |match|
      handle_match match.away_goals, match.home_goals
    end
    @relative_points = TeamGroupResults.relative_points points, goals_difference, goals_for
    @mutual_relative_points = 0
  end

  def to_s
    "#{ranking}. #{team_name} (#{team_id}) #{matches}  #{wins} #{draws} #{losses}  #{goals_for}-#{goals_against}  #{points}"
  end

  def team_name
    @team.name
  end

  def team_id
    @team.id
  end

  def lot
    @team.lot
  end

  def club_id
    @team.club_id
  end

  def goals_difference
    @goals_for - @goals_against
  end

  def self.relative_points(points, goals_difference, goals_for)
    10_000 * points + 100 * goals_difference + goals_for
  end

  private

  def use_match?(match, teams)
    teams.nil? || teams.map(&:id).include?(match.home_team_id) && teams.map(&:id).include?(match.away_team_id)
  end

  def handle_match(goals_for, goals_against)
    if goals_for
      @matches += 1
      if goals_for > goals_against
        @wins += 1
        @points += 3
      elsif goals_for == goals_against
        @draws += 1
        @points += 1
      else
        @losses += 1
      end
      @goals_for += goals_for
      @goals_against += goals_against
    end
  end
end
