class Referee < ApplicationRecord
  belongs_to :tournament

  validates :name, presence: true
  validates :access_key, presence: true
end
