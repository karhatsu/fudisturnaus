class AgeGroup < ApplicationRecord
  belongs_to :tournament
  has_many :groups
  has_many :playoff_matches

  validates :name, presence: true
end
