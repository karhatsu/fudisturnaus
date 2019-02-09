class TournamentsController < ApplicationController
  def show
    @tournament = Tournament.find params[:id]
    render 'home/index'
  end
end
