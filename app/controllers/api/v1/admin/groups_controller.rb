class Api::V1::Admin::GroupsController < Api::V1::Admin::AdminBaseController
  def create
    @group = Group.new group_params
    unless @group.save
      render status: 400, json: { errors: @group.errors.full_messages }
    end
  end

  def update
    @group = Group.find params[:id]
    unless @group.update group_params
      render status: 400, json: { errors: @group.errors.full_messages }
    end
  end

  def destroy
    group = Group.find params[:id]
    if group.destroy
      render status: 200, json: { id: group.id }
    else
      render status: 400, json: { errors: group.errors.full_messages }
    end
  end

  private

  def group_params
    params.require(:group).permit(:age_group_id, :name)
  end
end
