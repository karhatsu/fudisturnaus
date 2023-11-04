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
  belongs_to :referee, optional: true

  has_many :playoff_matches_as_home_team, as: :home_team_origin, class_name: 'PlayoffMatch'
  has_many :playoff_matches_as_away_team, as: :away_team_origin, class_name: 'PlayoffMatch'

  validates :title, presence: true
  validates :home_team_origin_rule, numericality: { only_integer: true, allow_nil: false }
  validates :away_team_origin_rule, numericality: { only_integer: true, allow_nil: false }
  validate :no_same_teams
  validate :teams_are_required

  before_save :reassign_home_team, :reassign_away_team

  delegate :tournament, to: :age_group
  delegate :tournament_id, to: :age_group

  def populate_next_round_playoff_matches
    changed_matches = []
    if home_goals && away_goals && home_goals != away_goals
      home_won = home_goals > away_goals

      playoff_matches_as_home_team.each do |match|
        if match.home_team_origin_rule == RULE_WINNER
          match.home_team = home_won ? home_team : away_team
          match.save!
          changed_matches << match
        elsif match.home_team_origin_rule == RULE_LOSER
          match.home_team = home_won ? away_team : home_team
          match.save!
          changed_matches << match
        end
      end

      playoff_matches_as_away_team.each do |match|
        if match.away_team_origin_rule == RULE_WINNER
          match.away_team = home_won ? home_team : away_team
          match.save!
          changed_matches << match
        elsif match.away_team_origin_rule == RULE_LOSER
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

  def date
    start_time.to_date
  end

  private

  def no_same_teams
    if home_team_origin_id == away_team_origin_id && home_team_origin_rule == away_team_origin_rule
      errors.add :base, 'Koti- ja vierasjoukkue eivät voi olla samoja'
    end
  end

  def teams_are_required
    if (home_goals || away_goals) && (!home_team_id || !away_team_id)
      errors.add :base, 'Tulosta ei voi tallentaa, koska joukkueita ei ole asetettu'
    end
  end

  def reassign_home_team
    if home_team_origin_id_changed? || home_team_origin_type_changed? || home_team_origin_rule_changed?
      if home_team_origin_type == 'Group'
        group = home_team_origin
        if group.can_assign_playoff_matches?
          self.home_team_id = group.results[home_team_origin_rule - 1].team_id
        else
          self.home_team_id = nil
        end
      elsif home_team_origin_type == 'PlayoffMatch'
        previous_round_match = home_team_origin
        if previous_round_match.home_won?
          self.home_team_id = home_team_origin_rule == RULE_WINNER ? previous_round_match.home_team_id : previous_round_match.away_team_id
        elsif previous_round_match.away_won?
          self.home_team_id = home_team_origin_rule == RULE_WINNER ? previous_round_match.away_team_id : previous_round_match.home_team_id
        else
          self.home_team_id = nil
        end
      end
    end
  end

  def reassign_away_team
    if away_team_origin_id_changed? || away_team_origin_type_changed? || away_team_origin_rule_changed?
      if away_team_origin_type == 'Group'
        group = away_team_origin
        if group.can_assign_playoff_matches?
          self.away_team_id = group.results[away_team_origin_rule - 1].team_id
        else
          self.away_team_id = nil
        end
      elsif away_team_origin_type == 'PlayoffMatch'
        previous_round_match = away_team_origin
        if previous_round_match.away_won?
          self.away_team_id = away_team_origin_rule == RULE_WINNER ? previous_round_match.away_team_id : previous_round_match.home_team_id
        elsif previous_round_match.home_won?
          self.away_team_id = away_team_origin_rule == RULE_WINNER ? previous_round_match.home_team_id : previous_round_match.away_team_id
        else
          self.away_team_id = nil
        end
      end
    end
  end
end
