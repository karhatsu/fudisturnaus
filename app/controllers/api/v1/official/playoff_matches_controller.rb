class Api::V1::Official::PlayoffMatchesController < Api::V1::Official::OfficialBaseController
  def create
    @playoff_match = PlayoffMatch.new match_params
    unless @playoff_match.save
      render status: 400, json: { errors: @playoff_match.errors.full_messages }
    end
  end

  def update
    @playoff_match = PlayoffMatch.find params[:id]
    unless @playoff_match.update match_params
      render status: 400, json: { errors: @playoff_match.errors.full_messages }
    end
  end

  def destroy
    match = PlayoffMatch.find params[:id]
    if match.destroy
      render status: 200, json: { id: match.id }
    else
      render status: 400, json: { errors: match.errors.full_messages }
    end
  end

  private

  def match_params
    allowed = [:age_group_id, :title, :start_time, :field_id,
               :home_team_origin_id, :home_team_origin_type, :home_team_origin_rule,
               :away_team_origin_id, :away_team_origin_type, :away_team_origin_rule,
               :playoff_group_id, :referee_id]
    params.require(:playoff_match).permit(allowed)
  end
end
