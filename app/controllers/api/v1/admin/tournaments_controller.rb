class Api::V1::Admin::TournamentsController < Api::V1::Admin::AdminBaseController
  def update
    @tournament = Tournament.find params[:id]
    unless @tournament.update(tournament_params)
      render status: 400, json: { errors: @tournament.errors.full_messages }
    end
  end

  private

  def tournament_params
    params.require(:tournament).permit(:name, :location, :address, :start_date, :days)
  end
end
