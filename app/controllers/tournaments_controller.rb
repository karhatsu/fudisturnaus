class TournamentsController < ApplicationController
  def show
    begin
      @tournament = Tournament.friendly.find(params[:id])
      return redirect_to "/t/#{@tournament.slug}" if @tournament && params[:id].to_i.to_s == params[:id]
      return redirect_to @tournament, status: :moved_permanently if request.path != tournament_path(@tournament)
      render 'home/index'
    rescue ActiveRecord::RecordNotFound
      render 'home/not_found'
    end
  end
end
