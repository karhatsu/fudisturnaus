class AgeGroup < ApplicationRecord
  belongs_to :tournament
  has_many :groups, -> {order(:name)}
  has_many :playoff_matches

  validates :name, presence: true

  before_destroy :check_usage

  private

  def check_usage
    unless groups.empty? && playoff_matches.empty?
      errors.add :base, 'Ikäryhmää ei voi poistaa, koska se on käytössä'
      throw :abort
    end
  end
end
