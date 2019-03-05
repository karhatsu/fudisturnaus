class Api::V1::Admin::AgeGroupsController < Api::V1::Admin::AdminBaseController
  def create
    @age_group = AgeGroup.new age_group_params
    @age_group.tournament_id = params[:tournament_id]
    unless @age_group.save
      render status: 400, json: { errors: @age_group.errors.full_messages }
    end
  end

  def update
    @age_group = AgeGroup.find params[:id]
    unless @age_group.update age_group_params
      render status: 400, json: { errors: @age_group.errors.full_messages }
    end
  end

  def destroy
    age_group = AgeGroup.find params[:id]
    if age_group.destroy
      render status: 200, json: { id: age_group.id }
    else
      render status: 400, json: { errors: age_group.errors.full_messages }
    end
  end

  private

  def age_group_params
    params.require(:age_group).permit(:name, :calculate_group_tables)
  end
end
