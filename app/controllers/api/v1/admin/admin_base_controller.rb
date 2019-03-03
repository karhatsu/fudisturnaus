class Api::V1::Admin::AdminBaseController < ApplicationController
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  before_action :check_session_key

  private

  def check_session_key
    ok = AdminSession.find_by_key request.headers['HTTP_X_SESSION_KEY']
    render status: 401 unless ok
  end
end
