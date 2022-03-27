class Referees::RefereesController < ApplicationController
  layout 'official'

  before_action :check_referee_access_key

  def index
    render 'official/official/index'
  end

  private

  def check_referee_access_key
    referee_access_key = params[:referee_access_key]
    referee = Referee.find_by_access_key referee_access_key
    return redirect_to root_path unless referee
    @referee_id = referee.id
    @referee_name = referee.name
    @tournament = referee.tournament
  end
end
