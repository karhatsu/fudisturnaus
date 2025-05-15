class Api::V1::Public::TournamentsController < ApplicationController
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  def index
    tournaments = Tournament.all.includes(:club).except(:order).order('start_date DESC, name')
    tournaments = tournaments.where("name ilike ?", "%#{params[:name]}%") unless params[:name].blank?
    tournaments = tournaments.where("location ilike ?", "%#{params[:location]}%") unless params[:location].blank?
    tournaments = tournaments.where("start_date >= ?", params[:since]) unless params[:since].blank?
    tournaments = tournaments.where("start_date <= ?", params[:until]) unless params[:until].blank?
    @tournaments = tournaments
  end

  def show
    @tournament = Tournament.friendly.find(params[:id]).public_data
  end
end
