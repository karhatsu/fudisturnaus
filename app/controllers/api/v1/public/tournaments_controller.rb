class Api::V1::Public::TournamentsController < ApplicationController
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  def index
    @tournaments = Tournament.all.includes(:club)
  end

  def show
    @tournament = Tournament.find(params[:id]).public_data
  end
end
