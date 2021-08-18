class UnassignedPlayoffGroupTeam
  attr_reader :name

  def initialize(name)
    @name = name
  end

  def group_results(_, _ = nil)
    TeamGroupResults.new self, true
  end

  def playoff_home_matches
    []
  end

  def playoff_away_matches
    []
  end

  def id
    @name
  end

  def club_id
    nil
  end

  def lot
    nil
  end
end
