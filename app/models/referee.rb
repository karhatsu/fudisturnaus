require 'securerandom'

class Referee < ApplicationRecord
  belongs_to :tournament, touch: true

  validates :name, presence: true

  before_create :generate_access_key

  private

  def generate_access_key
    self.access_key = SecureRandom.hex
  end
end
