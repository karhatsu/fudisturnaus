class Api::V1::Official::OfficialBaseController < ApplicationController
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  before_action :check_access_key

  private

  def check_access_key
    @tournament = Tournament.find_by_access_key request.headers['HTTP_X_ACCESS_KEY']
    render status: 401, body: nil unless @tournament
  end
end
