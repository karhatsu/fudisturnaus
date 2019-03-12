class Api::V1::Official::ClubsController < Api::V1::Official::OfficialBaseController
  def create
    name = params[:name]
    @club = Club.where('LOWER(name) = ?', name.downcase).first_or_create(name: name)
  end

  private

  def tournament_id
    nil
  end
end
