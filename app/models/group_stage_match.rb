class GroupStageMatch < ApplicationRecord
  belongs_to :group
  belongs_to :field
  belongs_to :home_team, class_name: 'Team'
  belongs_to :away_team, class_name: 'Team'

  validates :home_goals, numericality: { only_integer: true, greater_than_or_equal_to: 0, allow_nil: true }
  validates :away_goals, numericality: { only_integer: true, greater_than_or_equal_to: 0, allow_nil: true }
  validate :verify_both_goals

  delegate :age_group_id, to: :group

  def tournament_id
    group.age_group.tournament_id
  end

  private

  def verify_both_goals
    errors.add :base, 'Molemmat maalit pitää syöttää' if !home_goals && away_goals || home_goals && !away_goals
  end
end
