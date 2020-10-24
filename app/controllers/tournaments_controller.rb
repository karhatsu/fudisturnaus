class TournamentsController < ApplicationController
  def show
    begin
      @tournament = Tournament.friendly.find(params[:id])
      render 'home/index'
    rescue ActiveRecord::RecordNotFound
      render 'home/not_found'
    end
  end
end
