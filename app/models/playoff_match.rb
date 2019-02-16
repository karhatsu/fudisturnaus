class PlayoffMatch < ApplicationRecord
  include Match

  belongs_to :age_group
  belongs_to :home_team_origin, polymorphic: true
  belongs_to :away_team_origin, polymorphic: true
  belongs_to :home_team, class_name: 'Team', optional: true
  belongs_to :away_team, class_name: 'Team', optional: true

  has_many :next_round_playoff_matches_as_home_team, as: :home_team_origin, class_name: 'NextRoundPlayoffMatch'
  has_many :next_round_playoff_matches_as_away_team, as: :away_team_origin, class_name: 'NextRoundPlayoffMatch'

  validates :title, presence: true
  validate :draw_not_allowed
  validate :teams_are_required

  after_save :populate_next_round_playoff_matches

  delegate :tournament_id, to: :age_group

  private

  def draw_not_allowed
    errors.add :base, 'Jatko-ottelu ei voi päättyä tasan' if home_goals && away_goals && home_goals == away_goals
  end

  def teams_are_required
    if (home_goals || away_goals) && (!home_team_id || !away_team_id)
      errors.add :base, 'Tulosta ei voi tallentaa, koska joukkueita ei ole asetettu'
    end
  end

  def populate_next_round_playoff_matches
    if home_goals && away_goals
      home_won = home_goals > away_goals

      next_round_playoff_matches_as_home_team.each do |match|
        if match.home_team_origin_rule == NextRoundPlayoffMatch::RULE_WINNER
          match.home_team = home_won ? home_team : away_team
          match.save!
        elsif match.home_team_origin_rule == NextRoundPlayoffMatch::RULE_LOSER
          match.home_team = home_won ? away_team : home_team
          match.save!
        end
      end

      next_round_playoff_matches_as_away_team.each do |match|
        if match.away_team_origin_rule == NextRoundPlayoffMatch::RULE_WINNER
          match.away_team = home_won ? home_team : away_team
          match.save!
        elsif match.away_team_origin_rule == NextRoundPlayoffMatch::RULE_LOSER
          match.away_team = home_won ? away_team : home_team
          match.save!
        end
      end
    end
  end
end
