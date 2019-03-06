class Api::V1::Admin::TeamsController < Api::V1::Admin::AdminBaseController
  def create
    @team = Team.new team_params
    unless @team.save
      render status: 400, json: { errors: @team.errors.full_messages }
    end
  end

  def update
    @team = Team.find params[:id]
    unless @team.update team_params
      render status: 400, json: { errors: @team.errors.full_messages }
    end
  end

  def destroy
    team = Team.find params[:id]
    if team.destroy
      render status: 200, json: { id: team.id }
    else
      render status: 400, json: { errors: team.errors.full_messages }
    end
  end

  private

  def team_params
    params.require(:team).permit(:group_id, :club_id, :name)
  end
end
