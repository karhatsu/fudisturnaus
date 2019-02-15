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
end
