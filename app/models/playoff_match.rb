class PlayoffMatch < ApplicationRecord
  include Match

  RULE_LOSER = -2
  RULE_WINNER = -1

  belongs_to :age_group, touch: true
  belongs_to :home_team_origin, polymorphic: true
  belongs_to :away_team_origin, polymorphic: true
  belongs_to :home_team, class_name: 'Team', optional: true
  belongs_to :away_team, class_name: 'Team', optional: true
  belongs_to :playoff_group, optional: true

  has_many :playoff_matches_as_home_team, as: :home_team_origin, class_name: 'PlayoffMatch'
  has_many :playoff_matches_as_away_team, as: :away_team_origin, class_name: 'PlayoffMatch'

  validates :title, presence: true
  validates :home_team_origin_rule, numericality: { only_integer: true, allow_nil: false }
  validates :away_team_origin_rule, numericality: { only_integer: true, allow_nil: false }
  validate :no_same_teams
  validate :draw_not_allowed
  validate :teams_are_required

  delegate :tournament, to: :age_group
  delegate :tournament_id, to: :age_group

  def populate_next_round_playoff_matches
    changed_matches = []
    if home_goals && away_goals
      home_won = home_goals > away_goals

      playoff_matches_as_home_team.each do |match|
        if match.home_team_origin_rule == PlayoffMatch::RULE_WINNER
          match.home_team = home_won ? home_team : away_team
          match.save!
          changed_matches << match
        elsif match.home_team_origin_rule == PlayoffMatch::RULE_LOSER
          match.home_team = home_won ? away_team : home_team
          match.save!
          changed_matches << match
        end
      end

      playoff_matches_as_away_team.each do |match|
        if match.away_team_origin_rule == PlayoffMatch::RULE_WINNER
          match.away_team = home_won ? home_team : away_team
          match.save!
          changed_matches << match
        elsif match.away_team_origin_rule == PlayoffMatch::RULE_LOSER
          match.away_team = home_won ? away_team : home_team
          match.save!
          changed_matches << match
        end
      end
    end
    changed_matches
  end

  def day
    (start_time.to_date - tournament.start_date).to_i + 1
  end

  private

  def no_same_teams
    if home_team_origin_id == away_team_origin_id && home_team_origin_rule == away_team_origin_rule
      errors.add :base, 'Koti- ja vierasjoukkue eivät voi olla samoja'
    end
  end

  def draw_not_allowed
    errors.add :base, 'Jatko-ottelu ei voi päättyä tasan' if home_goals && away_goals && home_goals == away_goals
  end

  def teams_are_required
    if (home_goals || away_goals) && (!home_team_id || !away_team_id)
      errors.add :base, 'Tulosta ei voi tallentaa, koska joukkueita ei ole asetettu'
    end
  end
end
