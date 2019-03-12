class Api::V1::Official::GroupStageMatchesController < Api::V1::Official::OfficialBaseController
  def create
    @group_stage_match = GroupStageMatch.new match_params
    unless @group_stage_match.save
      render status: 400, json: { errors: @group_stage_match.errors.full_messages }
    end
  end

  def update
    @group_stage_match = GroupStageMatch.find params[:id]
    unless @group_stage_match.update match_params
      render status: 400, json: { errors: @group_stage_match.errors.full_messages }
    end
  end

  def destroy
    match = GroupStageMatch.find params[:id]
    if match.destroy
      render status: 200, json: { id: match.id }
    else
      render status: 400, json: { errors: match.errors.full_messages }
    end
  end

  private

  def match_params
    params.require(:group_stage_match).permit(:start_time, :field_id, :group_id, :home_team_id, :away_team_id)
  end
end
