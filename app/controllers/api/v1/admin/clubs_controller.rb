class Api::V1::Admin::ClubsController < Api::V1::Admin::AdminBaseController
  def index
    @clubs = Club.all
  end

  def update
    @club = Club.find params[:id]
    unless @club.update club_params
      render status: 400, json: { errors: @club.errors.full_messages }
    end
  end

  def destroy
    @club = Club.find params[:id]
    unless @club.destroy
      render status: 400, json: { errors: @club.errors.full_messages }
    end
  end

  private

  def club_params
    params.require(:club).permit(:name, :logo_url)
  end
end
