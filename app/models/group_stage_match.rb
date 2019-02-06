class GroupStageMatch < ApplicationRecord
  belongs_to :group
  belongs_to :field
  belongs_to :home_team, class_name: 'Team'
  belongs_to :away_team, class_name: 'Team'

  validates :home_goals, numericality: { only_integer: true, greater_than_or_equal_to: 0, allow_nil: true }
  validates :away_goals, numericality: { only_integer: true, greater_than_or_equal_to: 0, allow_nil: true }

  delegate :age_group_id, to: :group

  def tournament_id
    group.age_group.tournament_id
  end
end
