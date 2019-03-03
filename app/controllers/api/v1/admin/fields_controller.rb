class Api::V1::Admin::FieldsController < Api::V1::Admin::AdminBaseController
  def create
    field = Field.new field_params
    field.tournament_id = params[:tournament_id]
    if field.save
      render status: 200, json: { id: field.id }
    else
      render status: 400, json: { errors: field.errors.full_messages }
    end
  end

  def update
    field = Field.find params[:id]
    if field.update field_params
      render status: 200, json: { id: field.id }
    else
      render status: 400, json: { errors: field.errors.full_messages }
    end
  end

  private

  def field_params
    params.require(:field).permit(:name)
  end
end
