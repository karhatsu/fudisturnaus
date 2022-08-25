class TournamentsController < ApplicationController
  def show
    begin
      @tournament = Tournament.friendly.find(params[:id])
      return redirect_to "/t/#{@tournament.slug}" if @tournament && params[:id].to_i.to_s == params[:id]
      return redirect_to "/t/#{@tournament.slug}", status: :moved_permanently if @tournament && request.path != "/t/#{@tournament.slug}"
      render 'home/index'
    rescue ActiveRecord::RecordNotFound
      render 'home/not_found'
    end
  end
end
