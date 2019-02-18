class AgeGroup < ApplicationRecord
  belongs_to :tournament
  has_many :groups, -> {order(:name)}
  has_many :playoff_matches

  validates :name, presence: true
end
