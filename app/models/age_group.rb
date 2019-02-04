class AgeGroup < ApplicationRecord
  belongs_to :tournament
  has_many :groups

  validates :name, presence: true
end
