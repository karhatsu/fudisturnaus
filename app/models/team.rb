class Team < ApplicationRecord
  belongs_to :club
  belongs_to :group, touch: true
  has_many :group_stage_home_matches, foreign_key: :home_team_id, class_name: 'GroupStageMatch'
  has_many :group_stage_away_matches, foreign_key: :away_team_id, class_name: 'GroupStageMatch'
  has_many :playoff_home_matches, foreign_key: :home_team_id, class_name: 'PlayoffMatch'
  has_many :playoff_away_matches, foreign_key: :away_team_id, class_name: 'PlayoffMatch'

  validates :name, presence: true
  validates :group_stage_number, numericality: { only_integer: true, greater_than_or_equal_to: 1, allow_nil: true }
  validates :lot, numericality: { only_integer: true, allow_nil: true }

  before_destroy :check_usage

  delegate :age_group_id, to: :group

  def group_results(playoff = false, teams = nil)
    TeamGroupResults.new self, playoff, teams
  end

  private

  def check_usage
    unless group_stage_home_matches.empty? && group_stage_away_matches.empty?
      errors.add :base, 'Joukkuetta ei voi poistaa, koska se on käytössä'
      throw :abort
    end
  end
end
