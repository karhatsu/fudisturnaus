class TeamGroupResults
  attr_reader :matches, :wins, :draws, :losses, :goals_for, :goals_against, :points, :team

  def initialize(team)
    @matches = 0
    @wins = 0
    @draws = 0
    @losses = 0
    @goals_for = 0
    @goals_against = 0
    @points = 0
    @team = team
    team.group_stage_home_matches.each do |match|
      handle_match match.home_goals, match.away_goals
    end
    team.group_stage_away_matches.each do |match|
      handle_match match.away_goals, match.home_goals
    end
  end

  def team_name
    @team.name
  end

  def goals_difference
    @goals_for - @goals_against
  end

  private

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
