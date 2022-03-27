class Api::V1::Official::RefereesController < Api::V1::Official::OfficialBaseController
  def create
    @referee = Referee.new referee_params
    @referee.tournament_id = params[:tournament_id]
    unless @referee.save
      render status: 400, json: { errors: @referee.errors.full_messages }
    end
  end

  def update
    @referee = @tournament.referees.find params[:id]
    unless @referee.update referee_params
      render status: 400, json: { errors: @referee.errors.full_messages }
    end
  end

  def destroy
    referee = @tournament.referees.find params[:id]
    if referee.destroy
      render status: 200, json: { id: referee.id }
    else
      render status: 400, json: { errors: referee.errors.full_messages }
    end
  end

  private

  def referee_params
    params.require(:referee).permit(:name)
  end
end
