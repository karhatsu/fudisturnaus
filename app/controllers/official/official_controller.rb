class Official::OfficialController < ApplicationController
  layout 'official'

  before_action :check_access_key

  def index
  end

  private

  def check_access_key
    @access_key = params[:access_key]
    @tournament = Tournament.find_by_access_key @access_key
    redirect_to root_path unless @tournament
  end
end
