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

  after_save :populate_next_round_playoff_matches

  delegate :tournament_id, to: :age_group

  private

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
