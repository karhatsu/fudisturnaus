class Api::V1::Official::TournamentsController < Api::V1::Official::OfficialBaseController
  def show
    includes = {
        age_groups: [groups: [:age_group, :teams, group_stage_matches: [:field, :home_team, :away_team]]],
        groups: [teams: :club]
    }
    @tournament = Tournament.where(id: tournament_id).includes(includes).first
    @clubs = Club.all
  end

  def update
    unless @tournament.update(tournament_params)
      render status: 400, json: { errors: @tournament.errors.full_messages }
    end
  end

  private

  def tournament_id
    params[:id]
  end

  def tournament_params
    params.require(:tournament).permit(:name, :location, :address, :start_date, :days, :match_minutes, :equal_points_rule, :visibility, :club_id, :cancelled)
  end
end
