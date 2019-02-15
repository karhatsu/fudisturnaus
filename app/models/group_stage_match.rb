class GroupStageMatch < ApplicationRecord
  include Match

  belongs_to :group
  belongs_to :home_team, class_name: 'Team'
  belongs_to :away_team, class_name: 'Team'

  after_save :populate_first_round_playoff_matches

  delegate :age_group, to: :group
  delegate :age_group_id, to: :group

  def tournament_id
    group.age_group.tournament_id
  end

  def populate_first_round_playoff_matches
    group.populate_first_round_playoff_matches if group.results_in_all_matches?
  end
end
