class Group < ApplicationRecord
  belongs_to :age_group
  has_many :teams
  has_many :group_stage_matches

  validates :name, presence: true
end
