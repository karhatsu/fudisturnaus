class Api::V1::Admin::TournamentsController < Api::V1::Admin::AdminBaseController
  def create
    @tournament = Tournament.new tournament_params
    unless @tournament.save
      render status: 400, json: { errors: @tournament.errors.full_messages }
    end
  end

  def destroy
    tournament = Tournament.find(params[:id])
    if tournament.destroy
      render status: 204, body: nil
    else
      render status: 400, json: { errors: ['Turnausta ei voi poistaa'] }
    end
  end

  private

  def tournament_params
    params.require(:tournament).permit(:name, :location, :address, :start_date, :days, :match_minutes, :visibility, :test, :club_id)
  end
end
