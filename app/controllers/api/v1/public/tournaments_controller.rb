class Api::V1::Public::TournamentsController < ApplicationController
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  def index
    @tournaments = Tournament.all.includes(:club).except(:order).order('start_date DESC, name')
  end

  def show
    @tournament = Tournament.friendly.find(params[:id]).public_data
  end
end
