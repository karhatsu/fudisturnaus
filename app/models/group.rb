class Group < ApplicationRecord
  belongs_to :age_group, touch: true
  has_many :teams
  has_many :group_stage_matches
  has_many :playoff_matches_as_home_team, as: :home_team_origin, class_name: 'PlayoffMatch'
  has_many :playoff_matches_as_away_team, as: :away_team_origin, class_name: 'PlayoffMatch'

  validates :name, presence: true

  before_destroy :check_usage

  delegate :tournament, to: :age_group

  def results
    return [] unless age_group.calculate_group_tables?
    sorted_teams = teams.map(&:group_results).sort do |a, b|
      [b.relative_points, a.team_name] <=> [a.relative_points, b.team_name]
    end
    prev_team_relative_points = -1
    prev_team_ranking = -1
    sorted_teams.map.with_index do |team, index|
      team.ranking = team.relative_points == prev_team_relative_points ? prev_team_ranking : index + 1
      prev_team_relative_points = team.relative_points
      prev_team_ranking = team.ranking
    end
    sorted_teams
  end

  def results_in_all_matches?
    group_stage_matches.all? { |match| match.home_goals && match.away_goals }
  end

  def populate_first_round_playoff_matches
    changed_matches = []
    group_results = results
    playoff_matches_as_home_team.each do |match|
      match.home_team_id = group_results[match.home_team_origin_rule - 1].team_id
      match.save!
      changed_matches << match
    end
    playoff_matches_as_away_team.each do |match|
      match.away_team_id = group_results[match.away_team_origin_rule - 1].team_id
      match.save!
      changed_matches << match
    end
    changed_matches
  end

  private

  def check_usage
    unless teams.empty?
      errors.add :base, 'Lohkoa ei voi poistaa, koska se on käytössä'
      throw :abort
    end
  end
end
