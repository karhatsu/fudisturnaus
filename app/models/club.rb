class Club < ApplicationRecord
  has_many :teams, dependent: :restrict_with_error
  default_scope -> { order(:name) }
  validates :name, presence: true
end
