class Team < ApplicationRecord
  belongs_to :club
  belongs_to :group

  validates :name, presence: true
  validates :group_stage_number, numericality: { only_integer: true, greater_than_or_equal_to: 1, allow_nil: true }
end
