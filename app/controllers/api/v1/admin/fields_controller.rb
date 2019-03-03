class Api::V1::Admin::FieldsController < Api::V1::Admin::AdminBaseController
  def update
    field = Field.find params[:id]
    if field.update field_params
      render status: 204, body: nil
    else
      render status: 400, json: { errors: field.errors.full_messages }
    end
  end

  private

  def field_params
    params.require(:field).permit(:name)
  end
end
