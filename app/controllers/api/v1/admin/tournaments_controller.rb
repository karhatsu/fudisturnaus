class Api::V1::Admin::TournamentsController < Api::V1::Admin::AdminBaseController
  def show
    @tournament = Tournament.where(id: params[:id]).includes(:age_groups, :fields).first
  end

  def update
    @tournament = Tournament.find params[:id]
    unless @tournament.update(tournament_params)
      render status: 400, json: { errors: @tournament.errors.full_messages }
    end
  end

  private

  def tournament_params
    params.require(:tournament).permit(:name, :location, :address, :start_date, :days, :calculate_group_tables)
  end
end
