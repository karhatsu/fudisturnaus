class Field < ApplicationRecord
  belongs_to :tournament, touch: true
  has_many :group_stage_matches
  has_many :playoff_matches

  validates :name, presence: true

  before_destroy :check_usage

  private

  def check_usage
    unless group_stage_matches.empty? && playoff_matches.empty?
      errors.add :base, 'Kenttää ei voi poistaa, koska se on käytössä otteluissa'
      throw :abort
    end
  end
end
