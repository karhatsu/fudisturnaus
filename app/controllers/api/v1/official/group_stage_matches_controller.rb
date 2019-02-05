class Api::V1::Official::GroupStageMatchesController < Api::V1::Official::OfficialBaseController
  before_action :find_and_verity_match

  def update
    if @match.update match_params
      render status: 200, json: @match.to_json
    else
      render status: 400, json: { errors: @match.errors.full_messages }
    end
  end

  private

  def find_and_verity_match
    @match = GroupStageMatch.find params[:id]
    render status: 401, body: nil if @match.tournament_id != @tournament.id
  end

  def match_params
    params.require(:group_stage_match).permit(:home_goals, :away_goals)
  end
end
