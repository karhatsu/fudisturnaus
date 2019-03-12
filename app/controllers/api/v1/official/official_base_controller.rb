class Api::V1::Official::OfficialBaseController < ApplicationController
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  before_action :check_access

  private

  def check_access
    official_access_key = request.headers['HTTP_X_ACCESS_KEY']
    admin_session_key = request.headers['HTTP_X_SESSION_KEY']
    if official_access_key
      @tournament = Tournament.where('id=? AND access_key=?', tournament_id, official_access_key).first
      render status: 401, body: nil unless @tournament
    elsif admin_session_key
      ok = AdminSession.find_by_key admin_session_key
      render status: 401, body: nil unless ok
      @tournament = Tournament.find tournament_id if tournament_id # ClubsController does not have it
    else
      render status: 401, body: nil
    end
  end

  def tournament_id
    params[:tournament_id]
  end
end
