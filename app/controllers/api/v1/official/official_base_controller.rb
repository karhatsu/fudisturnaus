class Api::V1::Official::OfficialBaseController < ApplicationController
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  before_action :check_access

  private

  def check_access
    official_access_key = request.headers['HTTP_X_ACCESS_KEY']
    results_access_key = request.headers['HTTP_X_RESULTS_ACCESS_KEY']
    admin_session_key = request.headers['HTTP_X_SESSION_KEY']
    if official_access_key
      @tournament = Tournament.where('access_key=?', official_access_key).first
      render status: 401, body: nil unless @tournament
    elsif results_access_key
      render status: 401, body: nil unless allow_results_access_key?
      @tournament = Tournament.where('results_access_key=?', results_access_key).first
      render status: 401, body: nil unless @tournament
    elsif admin_session_key
      ok = AdminSession.find_by_key admin_session_key
      render status: 401, body: nil unless ok
      @tournament = Tournament.find tournament_id if tournament_id # ClubsController does not have it
    else
      render status: 401, body: nil
    end
  end

  def allow_results_access_key?
    false
  end

  def tournament_id
    params[:tournament_id]
  end
end
