class Api::V1::TournamentsController < ApplicationController
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  def index
    @tournaments = Tournament.all
  end

  def show
    @tournament = Tournament.where('id=?', params[:id]).includes(age_groups: [groups: [group_stage_matches: [:field, :home_team, :away_team]]]).first
  end
end
