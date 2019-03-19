class Api::V1::Public::TournamentsController < ApplicationController
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  def index
    @tournaments = Tournament.all
  end

  def show
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
    @tournament = Tournament.where('id=?', params[:id]).includes(includes).first
  end
end
