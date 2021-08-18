class Api::V1::Official::PlayoffGroupsController < Api::V1::Official::OfficialBaseController
  def create
    @playoff_group = PlayoffGroup.new group_params
    unless @playoff_group.save
      render status: 400, json: { errors: @playoff_group.errors.full_messages }
    end
  end

  def update
    @playoff_group = PlayoffGroup.find params[:id]
    unless @playoff_group.update group_params
      render status: 400, json: { errors: @playoff_group.errors.full_messages }
    end
  end

  def destroy
    playoff_group = PlayoffGroup.find params[:id]
    if playoff_group.destroy
      render status: 200, json: { id: playoff_group.id }
    else
      render status: 400, json: { errors: playoff_group.errors.full_messages }
    end
  end

  private

  def group_params
    params.require(:group).permit(:age_group_id, :name)
  end
end
