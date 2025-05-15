class GroupStageMatch < ApplicationRecord
  include Match

  belongs_to :group, touch: true
  belongs_to :home_team, class_name: 'Team'
  belongs_to :away_team, class_name: 'Team'
  belongs_to :referee, optional: true

  validates :start_time, presence: true
  validate :no_same_teams

  around_save :update_tournament_dates
  before_destroy :check_usage

  delegate :age_group, to: :group
  delegate :age_group_id, to: :group
  delegate :tournament, to: :group

  def tournament_id
    group.age_group.tournament_id
  end

  def populate_first_round_playoff_matches
    return group.populate_first_round_playoff_matches if home_goals && away_goals
    []
  end

  def day
    (start_time.to_date - tournament.start_date).to_i + 1
  end

  def date
    start_time.to_date
  end

  private

  def no_same_teams
    errors.add :base, 'Koti- ja vierasjoukkue eivät voi olla samoja' if home_team_id && away_team_id && home_team_id == away_team_id
  end

  def update_tournament_dates
    old_date = start_time_was&.to_date
    yield
    tournament.update_dates if old_date != date && tournament.days == 0
  end

  def check_usage
    if home_goals && away_goals
      errors.add :base, 'Ottelua ei voi poistaa, koska sille on jo syötetty tulos'
      throw :abort
    end
  end
end
