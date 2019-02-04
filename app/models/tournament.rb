require 'securerandom'

class Tournament < ApplicationRecord
  has_many :age_groups

  validates :name, presence: true
  validates :start_date, presence: true
  validates :days, numericality: { only_integer: true, greater_than_or_equal_to: 1 }
  validates :location, presence: true

  before_create :generate_access_key

  default_scope { order('start_date DESC') }

  def end_date
    start_date + (days - 1).days
  end

  private

  def generate_access_key
    self.access_key = SecureRandom.hex
  end
end
