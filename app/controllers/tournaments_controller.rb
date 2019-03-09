class TournamentsController < ApplicationController
  def show
    @tournament = Tournament.where(id: params[:id]).first
    return render 'home/not_found' unless @tournament
    render 'home/index'
  end
end
