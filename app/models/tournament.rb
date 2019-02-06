require 'securerandom'

class Tournament < ApplicationRecord
  has_many :age_groups
  has_many :groups, through: :age_groups

  validates :name, presence: true
  validates :start_date, presence: true
  validates :days, numericality: { only_integer: true, greater_than_or_equal_to: 1 }
  validates :location, presence: true

  before_create :generate_access_key

  default_scope { order('start_date DESC') }

  def teams
    groups.flat_map {|g| g.teams }.sort { |a, b| a.name <=> b.name }
  end

  def end_date
    start_date + (days - 1).days
  end

  def group_stage_matches
    age_groups
        .flat_map { |ag| ag.groups.flat_map &:group_stage_matches }
        .sort { |a, b| [a.start_time, a.field.name] <=> [b.start_time, b.field.name] }
  end

  private

  def generate_access_key
    self.access_key = SecureRandom.hex
  end
end
