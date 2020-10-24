require 'securerandom'

class Tournament < ApplicationRecord
  extend FriendlyId

  EQUAL_POINTS_RULE_ALL_MATCHES_FIRST = 0
  EQUAL_POINTS_RULE_MUTUAL_MATCHES_FIRST = 1
  VISIBILITY_ONLY_TITLE = 0
  VISIBILITY_TEAMS = 1
  VISIBILITY_ALL = 2

  friendly_id :name, use: :slugged

  belongs_to :club, optional: true
  has_many :age_groups, -> {order(:name)}
  has_many :groups, -> {order(:name)}, through: :age_groups
  has_many :fields, -> {order(:name)}, dependent: :destroy

  validates :name, presence: true
  validates :start_date, presence: true
  validates :days, numericality: { only_integer: true, greater_than_or_equal_to: 1 }
  validates :location, presence: true
  validates :match_minutes, numericality: { only_integer: true, greater_than_or_equal_to: 15, less_than_or_equal_to: 180 }
  validates :equal_points_rule, inclusion: { in: [EQUAL_POINTS_RULE_ALL_MATCHES_FIRST, EQUAL_POINTS_RULE_MUTUAL_MATCHES_FIRST] }
  validates :visibility, inclusion: { in: [VISIBILITY_ONLY_TITLE, VISIBILITY_TEAMS, VISIBILITY_ALL] }

  before_create :generate_access_keys
  around_update :check_match_dates

  default_scope { order('start_date DESC') }

  def teams
    groups.flat_map {|g| g.teams }.sort { |a, b| a.name <=> b.name }
  end

  def clubs
    groups.flat_map {|g| g.teams.flat_map(&:club)}.uniq.sort { |a, b| a.name <=> b.name }
  end

  def end_date
    start_date + (days - 1).days
  end

  def calculate_group_tables
    age_groups.any?(&:calculate_group_tables?)
  end

  def group_stage_matches
    age_groups
        .includes(groups: [group_stage_matches: :field])
        .flat_map { |ag| ag.groups.flat_map &:group_stage_matches }
        .sort { |a, b| [a.start_time, a.field.name] <=> [b.start_time, b.field.name] }
  end

  def playoff_matches
    age_groups
        .includes(playoff_matches: :field)
        .flat_map(&:playoff_matches)
        .sort { |a, b| [a.start_time, a.field.name] <=> [b.start_time, b.field.name] }
  end

  def public_data
    Rails.cache.fetch(cache_key_with_version) do
      includes = {
        age_groups: [
          playoff_matches: [:field, :home_team, :away_team],
          groups: [
            :age_group,
            group_stage_matches: [:field, :home_team, :away_team],
            teams: [:group_stage_home_matches, :group_stage_away_matches]
          ]
        ],
        fields: [],
        groups: [teams: :club]
      }
      Tournament.where('id=?', id).includes(includes).first
    end
  end

  private

  def generate_access_keys
    self.access_key = SecureRandom.hex
    self.results_access_key = SecureRandom.hex
  end

  def check_match_dates
    date_diff = (start_date - start_date_was).to_i
    yield
    if date_diff != 0
      (group_stage_matches + playoff_matches).each do |match|
        match.start_time = match.start_time + date_diff.days
        match.save!
      end
    end
  end
end
