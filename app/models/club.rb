class Club < ApplicationRecord
  has_many :teams, dependent: :restrict_with_error
  default_scope -> { order(:name) }
  validates :name, presence: true

  def tournaments
    teams = Team.where club_id: id
    teams.map { |t| t.group.age_group.tournament.name }
  end

  def self.by_name(name)
    self.find_by_name name
  end

  def name_to_file_name
    name.gsub(' ', '-').gsub(/[äåÄÅ]/, 'a').gsub(/[öÖ]/, 'o').downcase
  end
end
