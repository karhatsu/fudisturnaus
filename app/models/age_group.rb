class AgeGroup < ApplicationRecord
  belongs_to :tournament

  validates :name, presence: true
end
